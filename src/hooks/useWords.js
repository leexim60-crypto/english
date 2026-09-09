import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { words as localWords, sentences as localSentences } from '../data/words.js'

/**
 * 从后端加载精选词库；后端不可用时自动回退到本地静态数据，
 * 保证 UI 永远有数据可渲染，不会白屏。
 */
export function useWords() {
  const [state, setState] = useState({
    words: localWords,
    sentences: localSentences,
    counts: { core: localWords.length, cet6: 0 },
    source: 'local', // 'server' | 'local'
    loading: true,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.getWords()
        if (cancelled) return
        if (Array.isArray(data.words) && data.words.length > 0) {
          setState({
            words: data.words,
            sentences: Array.isArray(data.sentences) ? data.sentences : localSentences,
            counts: data.counts || { core: data.words.length, cet6: 0 },
            source: 'server',
            loading: false,
          })
        } else {
          setState((s) => ({ ...s, loading: false }))
        }
      } catch {
        // 后端未启动 / 网络错误：保持本地数据
        if (!cancelled) setState((s) => ({ ...s, loading: false }))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
