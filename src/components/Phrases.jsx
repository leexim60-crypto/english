import { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'
import { lsGetJSON, lsSet } from '../utils/storage.js'
import { toast } from '../utils/toast.js'
import Icon from './Icons.jsx'
import SpeakButton from './SpeakButton.jsx'
import Reveal from './Reveal.jsx'

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
  const [learnedIds, setLearnedIds] = useState(() => lsGetJSON('learnedPhrases', []))
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
    const removing = learnedIds.includes(id)
    setLearnedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      lsSet('learnedPhrases', next)
      return next
    })
    toast(removing ? '已取消学会标记' : '已标记为学会 ✓', removing ? 'info' : 'success', 1500)
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
  const dateText = today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })

  return (
    <div className="phrases">
      <h2 className="phrases-title">
        <Icon name="chat" size={24} />
        短语学习
      </h2>

      {/* ===== 每日短语 ===== */}
      <section className={`sentence-card phrase-daily ${daily ? '' : 'is-placeholder'}`}>
        <div className="sentence-head">
          <span className="sentence-label">
            <Icon name="sparkle" size={13} /> Phrase of the day · {dateText}
          </span>
          {daily && <SpeakButton text={daily.phrase} variant="ghost" title="朗读短语" />}
        </div>
        {dailyLoading ? (
          <p className="sentence-cn">加载中…</p>
        ) : daily ? (
          <>
            <blockquote className="sentence-en">{daily.phrase}</blockquote>
            <p className="sentence-cn">{daily.translation}</p>
            {daily.word && (
              <p className="sentence-author">关联单词：{daily.word}</p>
            )}
          </>
        ) : (
          <p className="sentence-cn is-placeholder">
            {serverOnline
              ? '今日短语暂不可用，稍后再来看看。'
              : '每日短语需要后端服务在线（server 目录 npm start）。'}
          </p>
        )}
      </section>

      {/* ===== 视图切换 ===== */}
      <div className="book-tabs">
        <button
          className={`book-tab ${view === 'browse' ? 'book-tab-active' : ''}`}
          onClick={() => setView('browse')}
        >
          <Icon name="search" size={15} />
          挑选学习
        </button>
        <button
          className={`book-tab ${view === 'review' ? 'book-tab-active' : ''}`}
          onClick={() => setView('review')}
        >
          <Icon name="check" size={15} />
          已学会
          <span className="chip-num">{learnedIds.length}</span>
        </button>
      </div>

      {!serverOnline && view === 'browse' ? (
        <div className="card-page wordbook-empty">
          <span className="empty-icon">
            <Icon name="chat" size={26} />
          </span>
          <h2>短语库需要后端在线</h2>
          <p className="muted">短语库存储在服务器数据库中，需要后端服务在线。</p>
          <p className="muted">
            请先启动后端（server 目录 <code>npm start</code>）后再来学习短语。
          </p>
        </div>
      ) : view === 'browse' ? (
        /* ===== 浏览挑选 ===== */
        <div className="phrase-section">
          <div className="phrase-toolbar">
            <span className="muted">
              短语库共 <b className="num">{total}</b> 条 · 点击短语可查看/隐藏释义
            </span>
            <button className="btn btn-sm" onClick={loadBatch} disabled={loading}>
              <Icon name="refresh" size={14} />
              {loading ? '加载中…' : '换一批'}
            </button>
          </div>

          {error ? (
            <div className="card-page wordbook-empty">
              <p className="muted">短语加载失败，请稍后重试。</p>
              <button className="btn btn-primary" onClick={loadBatch}>重新加载</button>
            </div>
          ) : batch.length === 0 ? (
            loading ? (
              <div className="sk-list">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="sk-row">
                    <div className="sk sk-line" style={{ width: '66%' }} />
                    <div className="sk sk-line sk-line-sm" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">暂无短语</p>
            )
          ) : (
            <div className="phrase-list">
              {batch.map((p, i) => {
                const isLearned = learnedSet.has(p.id)
                const isRevealed = revealed.has(p.id)
                return (
                  <Reveal key={p.id} delay={Math.min(i, 8) * 40} className="phrase-row">
                    <div className={`phrase-item ${isLearned ? 'phrase-learned' : ''}`}>
                      <div
                        className="phrase-main"
                        onClick={() => toggleReveal(p.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            toggleReveal(p.id)
                          }
                        }}
                      >
                        <span className="phrase-en">
                          {p.phrase}
                          <SpeakButton text={p.phrase} variant="sm" />
                        </span>
                        <span className={`phrase-cn ${isRevealed ? 'is-revealed' : 'phrase-hidden'}`}>
                          {isRevealed ? p.translation : '点击查看释义'}
                        </span>
                      </div>
                      <button
                        className={`btn btn-sm ${isLearned ? 'btn-green' : ''}`}
                        onClick={() => toggleLearned(p.id)}
                        title={isLearned ? '取消学会' : '标记为已学会'}
                      >
                        <Icon name={isLearned ? 'check' : 'sparkle'} size={14} />
                        {isLearned ? '已学会' : '学会'}
                      </button>
                    </div>
                  </Reveal>
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
              <span className="empty-icon">
                <Icon name="check" size={26} />
              </span>
              <h2>还没有学会任何短语</h2>
              <p className="muted">去「挑选学习」里点「学会」收藏你掌握的短语吧。</p>
            </div>
          ) : reviewList.length === 0 ? (
            <div className="sk-list">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="sk-row">
                  <div className="sk sk-line" style={{ width: '60%' }} />
                  <div className="sk sk-line sk-line-sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="phrase-list">
              {reviewList.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 8) * 40} className="phrase-row">
                  <div className="phrase-item phrase-learned">
                    <div className="phrase-main">
                      <span className="phrase-en">
                        {p.phrase}
                        <SpeakButton text={p.phrase} variant="sm" />
                      </span>
                      <span className="phrase-cn is-revealed">{p.translation}</span>
                    </div>
                    <button
                      className="btn btn-sm"
                      onClick={() => toggleLearned(p.id)}
                      title="移除"
                    >
                      <Icon name="close" size={14} />
                      移除
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
