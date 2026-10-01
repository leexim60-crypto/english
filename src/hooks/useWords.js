import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { words as localWords, sentences as localSentences } from '../data/words.js'

const CACHE_KEY = 'wordsCache'

/**
 * 精选词库加载
 * ---------------------------------------------------------------
 * 三层数据源，保证任何时候都有合理数据可渲染：
 *   1. localStorage 缓存（上次成功拉到的完整词库，首屏立即可用）
 *   2. 后端接口（成功后写回缓存）
 *   3. 本地静态词库（兜底，仅 30 词）
 *
 * 后端是 Render 免费实例，冷启动可达 30s+，因此：
 *   - 首屏先用缓存渲染，避免"词汇总量"从 4092 变成 30 造成误解
 *   - 请求超时放宽，并做一次后台重试，冷启动恢复后自动刷新为真实数量
 */

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw)
    if (!c || !Array.isArray(c.words) || c.words.length === 0) return null
    return c
  } catch {
    return null
  }
}

function writeCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* 超出配额等情况忽略 */
  }
}

export function useWords() {
  const cached = readCache()

  const [state, setState] = useState(() => {
    if (cached) {
      return {
        words: cached.words,
        sentences: Array.isArray(cached.sentences) && cached.sentences.length
          ? cached.sentences
          : localSentences,
        counts: cached.counts || { core: cached.words.length, cet6: 0 },
        source: 'cache',
        loading: true,
      }
    }
    return {
      words: localWords,
      sentences: localSentences,
      counts: { core: localWords.length, cet6: 0 },
      source: 'local',
      loading: true,
    }
  })

  useEffect(() => {
    let cancelled = false

    const fetchWords = async (attempt = 0) => {
      try {
        const data = await api.getWords()
        if (cancelled) return
        if (Array.isArray(data.words) && data.words.length > 0) {
          const next = {
            words: data.words,
            sentences: Array.isArray(data.sentences) && data.sentences.length
              ? data.sentences
              : localSentences,
            counts: data.counts || { core: data.words.length, cet6: 0 },
          }
          writeCache(next)
          setState({ ...next, source: 'server', loading: false })
          return
        }
        if (!cancelled) setState((s) => ({ ...s, loading: false }))
      } catch {
        if (cancelled) return
        // 冷启动可能仍在唤醒：后台再试一次（用户已经看到缓存/本地数据，不会白屏）
        if (attempt < 1) {
          setTimeout(() => fetchWords(attempt + 1), 6000)
        } else {
          setState((s) => ({ ...s, loading: false }))
        }
      }
    }

    fetchWords()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
