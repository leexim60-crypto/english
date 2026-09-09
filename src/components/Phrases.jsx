import { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'

/**
 * 短语学习：每日短语 + 短语库浏览（自主选择学习）
 * 已学会的短语存 localStorage，刷新不丢；后端离线时显示提示。
 */
export default function Phrases({ source }) {
  // 每日短语
  const [daily, setDaily] = useState(null)
  const [dailyLoading, setDailyLoading] = useState(true)

  // 短语库浏览
  const [batch, setBatch] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // 查看释义（点开的短语 id 集合）
  const [revealed, setRevealed] = useState(() => {
    try {
      return new Set(JSON.parse(sessionStorage.getItem('phrRevealed') || '[]'))
    } catch {
      return new Set()
    }
  })

  // 已学会（localStorage 持久化）
  const [learnedIds, setLearnedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('learnedPhrases') || '[]')
    } catch {
      return []
    }
  })
  const learnedSet = new Set(learnedIds)

  // 复习模式：查看已学会列表
  const [view, setView] = useState('browse') // 'browse' | 'review'
  const [reviewList, setReviewList] = useState([])

  const serverOnline = source === 'server'

  // ===== 每日短语 =====
  useEffect(() => {
    let cancelled = false
    if (!serverOnline) {
      setDailyLoading(false)
      return
    }
    api
      .getDailyPhrase()
      .then((data) => {
        if (!cancelled) setDaily(data.phrase || null)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setDailyLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [serverOnline])

  // ===== 拉一批短语 =====
  const loadBatch = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await api.getRandomPhrases(30)
      if (Array.isArray(data.phrases) && data.phrases.length > 0) {
        setBatch(data.phrases)
        setTotal(data.total || 0)
        setRevealed(new Set())
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (serverOnline) loadBatch()
    else setLoading(false)
  }, [serverOnline]) // eslint-disable-line react-hooks/exhaustive-deps

  // ===== 学习状态持久化 =====
  const toggleLearned = (id) => {
    setLearnedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem('learnedPhrases', JSON.stringify(next))
      return next
    })
  }

  const toggleReveal = (id) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      sessionStorage.setItem('phrRevealed', JSON.stringify([...next]))
      return next
    })
  }

  // ===== 复习模式：按 id 拉已学会的短语 =====
  useEffect(() => {
    let cancelled = false
    if (view !== 'review') return
    if (learnedIds.length === 0) {
      setReviewList([])
      return
    }
    api
      .getPhrasesByIds(learnedIds)
      .then((data) => {
        if (!cancelled && Array.isArray(data.phrases)) {
          const map = new Map(data.phrases.map((p) => [p.id, p]))
          setReviewList(learnedIds.map((id) => map.get(id)).filter(Boolean))
        }
      })
      .catch(() => {
        if (!cancelled) setReviewList([])
      })
    return () => {
      cancelled = true
    }
  }, [view, learnedIds.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const today = new Date()

  return (
    <div className="phrases">
      <h2 className="phrases-title">💬 短语学习</h2>

      {/* ===== 每日短语 ===== */}
      <section className="sentence-card phrase-daily">
        <div className="sentence-label">
          📅 每日短语 · {today.toLocaleDateString('zh-CN')}
        </div>
        {dailyLoading ? (
          <p className="sentence-en">加载中…</p>
        ) : daily ? (
          <>
            <p className="sentence-en">“{daily.phrase}”</p>
            <p className="sentence-cn">{daily.translation}</p>
            {daily.word && (
              <p className="sentence-author">关联单词：{daily.word}</p>
            )}
          </>
        ) : (
          <p className="sentence-cn">
            {serverOnline ? '今日短语暂不可用' : '每日短语需要后端服务在线（server 目录 npm start）'}
          </p>
        )}
      </section>

      {/* ===== 视图切换 ===== */}
      <div className="book-tabs">
        <button
          className={`book-tab ${view === 'browse' ? 'book-tab-active' : ''}`}
          onClick={() => setView('browse')}
        >
          🔍 挑选学习
        </button>
        <button
          className={`book-tab ${view === 'review' ? 'book-tab-active' : ''}`}
          onClick={() => setView('review')}
        >
          ✅ 已学会（{learnedIds.length}）
        </button>
      </div>

      {!serverOnline && view === 'browse' ? (
        <div className="card-page wordbook-empty">
          <p className="muted">短语库存储在服务器数据库中，需要后端服务在线。</p>
          <p className="muted">请先启动后端（server 目录 npm start）后再来学习短语。</p>
        </div>
      ) : view === 'browse' ? (
        /* ===== 浏览挑选 ===== */
        <div className="phrase-section">
          <div className="phrase-toolbar">
            <span className="muted">
              短语库共 {total} 条 · 点击短语可查看/隐藏释义
            </span>
            <button className="btn btn-sm" onClick={loadBatch} disabled={loading}>
              {loading ? '加载中…' : '🔄 换一批'}
            </button>
          </div>

          {error ? (
            <div className="card-page wordbook-empty">
              <p className="muted">短语加载失败，请稍后重试。</p>
              <button className="btn btn-primary" onClick={loadBatch}>重新加载</button>
            </div>
          ) : batch.length === 0 ? (
            <p className="empty">{loading ? '正在加载短语…' : '暂无短语'}</p>
          ) : (
            <div className="phrase-list">
              {batch.map((p) => {
                const isLearned = learnedSet.has(p.id)
                const isRevealed = revealed.has(p.id)
                return (
                  <div key={p.id} className={`phrase-item ${isLearned ? 'phrase-learned' : ''}`}>
                    <div className="phrase-main" onClick={() => toggleReveal(p.id)}>
                      <span className="phrase-en">{p.phrase}</span>
                      {isRevealed ? (
                        <span className="phrase-cn">{p.translation}</span>
                      ) : (
                        <span className="phrase-cn phrase-hidden">点击查看释义</span>
                      )}
                    </div>
                    <button
                      className={`btn btn-sm ${isLearned ? 'btn-green' : ''}`}
                      onClick={() => toggleLearned(p.id)}
                      title={isLearned ? '取消学会' : '标记为已学会'}
                    >
                      {isLearned ? '✓ 已学会' : '+ 学会'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        /* ===== 复习已学会 ===== */
        <div className="phrase-section">
          {learnedIds.length === 0 ? (
            <div className="card-page wordbook-empty">
              <p className="muted">还没有学会任何短语～</p>
              <p className="muted">去「挑选学习」里点「+ 学会」收藏你掌握的短语吧！</p>
            </div>
          ) : reviewList.length === 0 ? (
            <p className="empty">加载中…</p>
          ) : (
            <div className="phrase-list">
              {reviewList.map((p) => (
                <div key={p.id} className="phrase-item phrase-learned">
                  <div className="phrase-main">
                    <span className="phrase-en">{p.phrase}</span>
                    <span className="phrase-cn">{p.translation}</span>
                  </div>
                  <button
                    className="btn btn-sm"
                    onClick={() => toggleLearned(p.id)}
                    title="移除"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
