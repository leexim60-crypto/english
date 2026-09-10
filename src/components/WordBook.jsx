import { useState, useEffect, useMemo } from 'react'
import { api } from '../api.js'
import { speak } from '../utils/speak.js'
import { recordReview, isDue, getDueIds, getNextReviewText } from '../utils/review.js'
import { words as allWords } from '../data/words.js'

export default function WordBook({ words, favorites, toggleFavorite }) {
  const safeFavorites = Array.isArray(favorites) ? favorites : []
  const safeWords = Array.isArray(words) ? words : allWords

  // ===== 工具栏状态：搜索 + 按词书筛选 =====
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | core | cet6

  // ===== 复习模式状态 =====
  const [reviewing, setReviewing] = useState(false)
  const [reviewQueue, setReviewQueue] = useState([])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewFlipped, setReviewFlipped] = useState(false)
  const [reviewResult, setReviewResult] = useState({ known: 0, unknown: 0 })

  // 收藏里不在本地精选词库的词（如六级词汇），从后端按 id 拉取
  const localIds = useMemo(() => new Set(safeWords.map((w) => w.id)), [safeWords])
  const missingIds = useMemo(
    () => safeFavorites.filter((id) => !localIds.has(id)),
    [safeFavorites, localIds]
  )

  const [remoteWords, setRemoteWords] = useState([])
  useEffect(() => {
    let cancelled = false
    if (missingIds.length === 0) {
      setRemoteWords([])
      return
    }
    api
      .getWordsByIds(missingIds)
      .then((data) => {
        if (!cancelled && Array.isArray(data.words)) setRemoteWords(data.words)
      })
      .catch(() => {
        if (!cancelled) setRemoteWords([])
      })
    return () => {
      cancelled = true
    }
  }, [missingIds.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  // 合并本地 + 后端词，按收藏顺序展示
  const allKnown = useMemo(() => {
    const map = new Map()
    for (const w of safeWords) map.set(w.id, w)
    for (const w of remoteWords) map.set(w.id, w)
    return map
  }, [safeWords, remoteWords])

  const list = safeFavorites.map((id) => allKnown.get(id)).filter(Boolean)

  const coreCount = list.filter((w) => localIds.has(w.id)).length
  const cet6Count = list.length - coreCount
  const dueCount = useMemo(
    () => getDueIds(safeFavorites).filter((id) => allKnown.has(id)).length,
    [safeFavorites, allKnown]
  )

  // ===== 搜索 + 筛选 =====
  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase()
    return list.filter((w) => {
      if (filter === 'core' && !localIds.has(w.id)) return false
      if (filter === 'cet6' && localIds.has(w.id)) return false
      if (!kw) return true
      return (
        w.word.toLowerCase().includes(kw) ||
        (w.meaning || '').toLowerCase().includes(kw)
      )
    })
  }, [list, search, filter, localIds])

  // ===== 导出生词本（txt 下载） =====
  const exportWordbook = () => {
    const lines = list.map(
      (w) =>
        `${w.word}  ${w.phonetic || ''}\n${w.meaning}` +
        (w.example ? `\n例句：${w.example}\n      ${w.exampleCn || ''}` : '')
    )
    const blob = new Blob([`⭐ 我的生词本（${list.length} 词）\n\n${lines.join('\n\n')}\n`], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `生词本-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ===== 复习模式：待复习的词翻卡流 =====
  const startReview = () => {
    const due = list.filter((w) => isDue(w.id))
    if (due.length === 0) return
    setReviewQueue(due)
    setReviewIndex(0)
    setReviewFlipped(false)
    setReviewResult({ known: 0, unknown: 0 })
    setReviewing(true)
  }

  const reviewCard = reviewQueue[reviewIndex]

  const reviewMark = (known) => {
    if (!reviewCard) return
    recordReview(reviewCard.id, known)
    setReviewResult((r) => ({
      known: r.known + (known ? 1 : 0),
      unknown: r.unknown + (known ? 0 : 1),
    }))
    if (!known) speak(reviewCard.word)
    setReviewFlipped(false)
    setTimeout(() => setReviewIndex((i) => i + 1), 150)
  }

  // ===== 复习模式 UI =====
  if (reviewing) {
    // 全部复习完
    if (reviewIndex >= reviewQueue.length) {
      return (
        <div className="wordbook">
          <div className="card-page wordbook-empty">
            <h2>🎉 复习完成！</h2>
            <p className="review-summary">
              本次共复习 {reviewQueue.length} 词：认识 {reviewResult.known} · 不认识 {reviewResult.unknown}
            </p>
            <p className="muted">
              认识的词下次复习间隔自动翻倍，不认识的词仍会优先出现在待复习列表中。
            </p>
            <div className="review-actions">
              <button className="btn btn-primary" onClick={() => setReviewing(false)}>
                返回生词本
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flashcards">
        <div className="review-header">
          <span>🔁 生词复习 · 第 {reviewIndex + 1} / {reviewQueue.length} 张</span>
          <button className="btn btn-sm" onClick={() => setReviewing(false)}>退出复习</button>
        </div>
        <div
          className={`card-3d ${reviewFlipped ? 'flipped' : ''}`}
          onClick={() => setReviewFlipped(!reviewFlipped)}
        >
          <div className="card-face card-front">
            <span className="card-level" style={{ background: '#f59e0b' }}>复习</span>
            <h2 className="card-word">{reviewCard.word}</h2>
            {reviewCard.phonetic && <p className="card-phonetic">{reviewCard.phonetic}</p>}
            <button
              className="speak-btn"
              onClick={(e) => {
                e.stopPropagation()
                speak(reviewCard.word)
              }}
              onTouchEnd={(e) => e.stopPropagation()}
              title="播放发音"
            >
              🔊
            </button>
            <p className="card-hint">先回忆释义，再点击卡片翻面对答案</p>
          </div>
          <div className="card-face card-back">
            <h3 className="card-meaning">{reviewCard.meaning}</h3>
            {reviewCard.example && (
              <div className="card-example">
                <p className="example-en">{reviewCard.example}</p>
                {reviewCard.exampleCn && <p className="example-cn">{reviewCard.exampleCn}</p>}
              </div>
            )}
          </div>
        </div>
        <div className="card-controls">
          <button className="btn btn-red" onClick={() => reviewMark(false)}>
            😕 不认识（稍后再复习）
          </button>
          <button className="btn btn-green" onClick={() => reviewMark(true)}>
            😀 认识（间隔翻倍）
          </button>
        </div>
      </div>
    )
  }

  // ===== 空状态 =====
  if (list.length === 0) {
    return (
      <div className="card-page wordbook-empty">
        <h2>⭐ 我的生词本</h2>
        <p className="muted">生词本是空的～</p>
        <p className="muted">去「单词卡片」页面点击 ☆ 收藏不熟悉的单词吧！</p>
      </div>
    )
  }

  // ===== 生词本列表 =====
  return (
    <div className="wordbook">
      <h2>⭐ 我的生词本（{list.length} 个单词）</h2>

      {/* 待复习提示 */}
      <div className="due-banner">
        <span>
          🔁 今日待复习 <strong>{dueCount}</strong> / {list.length} 词
        </span>
        <button
          className="btn btn-primary btn-sm"
          onClick={startReview}
          disabled={dueCount === 0}
          title={dueCount === 0 ? '今天的复习任务都完成啦' : '开始间隔复习'}
        >
          {dueCount === 0 ? '今日已复习完 ✓' : '开始复习'}
        </button>
      </div>

      {/* 工具栏：搜索 + 筛选 + 导出 */}
      <div className="wordbook-toolbar">
        <input
          className="wordbook-search"
          type="text"
          placeholder="搜索单词或释义…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="wordbook-filters">
          <button
            className={`chip ${filter === 'all' ? 'chip-active' : ''}`}
            style={filter === 'all' ? { background: 'var(--primary)', color: '#fff' } : {}}
            onClick={() => setFilter('all')}
          >
            全部 {list.length}
          </button>
          <button
            className={`chip ${filter === 'core' ? 'chip-active' : ''}`}
            style={filter === 'core' ? { background: '#3b82f6', color: '#fff' } : {}}
            onClick={() => setFilter('core')}
          >
            精选 {coreCount}
          </button>
          <button
            className={`chip ${filter === 'cet6' ? 'chip-active' : ''}`}
            style={filter === 'cet6' ? { background: '#0d9488', color: '#fff' } : {}}
            onClick={() => setFilter('cet6')}
          >
            六级 {cet6Count}
          </button>
          <button className="btn btn-sm" onClick={exportWordbook} title="导出为 txt 文件">
            📤 导出
          </button>
        </div>
      </div>

      <div className="wordbook-list">
        {filtered.map((w) => (
          <div className="wordbook-item" key={w.id}>
            <div className="wordbook-info">
              <div className="wordbook-word">
                <strong>{w.word}</strong>
                {w.phonetic && <span className="card-phonetic">{w.phonetic}</span>}
                {!localIds.has(w.id) && <span className="book-tag book-tag-cet6">六级</span>}
                <span className={`due-tag ${isDue(w.id) ? 'due-tag-hot' : ''}`}>
                  {isDue(w.id) ? '待复习' : getNextReviewText(w.id)}
                </span>
              </div>
              <div className="wordbook-meaning">{w.meaning}</div>
              {w.example && (
                <div className="wordbook-example">
                  <p className="example-en">{w.example}</p>
                  {w.exampleCn && <p className="example-cn">{w.exampleCn}</p>}
                </div>
              )}
            </div>
            <div className="wordbook-actions">
              <button
                className="btn btn-sm"
                onClick={() => speak(w.word)}
                title="播放发音"
              >
                🔊
              </button>
              <button
                className="btn btn-sm"
                onClick={() => toggleFavorite(w.id)}
                title="从生词本移除"
              >
                移除
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="empty">没有匹配「{search}」的单词</p>
        )}
      </div>
    </div>
  )
}
