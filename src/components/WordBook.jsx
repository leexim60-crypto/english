import { useState, useEffect, useMemo } from 'react'
import { api } from '../api.js'
import { recordReview, isDue, getDueIds, getNextReviewText } from '../utils/review.js'
import { words as allWords } from '../data/words.js'
import { toast } from '../utils/toast.js'
import Icon from './Icons.jsx'
import SpeakButton from './SpeakButton.jsx'
import Reveal from './Reveal.jsx'

export default function WordBook({ words, favorites, toggleFavorite, onGo }) {
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
    if (list.length === 0) {
      toast('生词本为空，先去收藏些单词吧 📚', 'info')
      return
    }
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
    toast(`已导出 ${list.length} 个单词到 txt 文件 📥`, 'success')
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
      const total = reviewResult.known + reviewResult.unknown
      const rate = total ? Math.round((reviewResult.known / total) * 100) : 0
      return (
        <div className="wordbook">
          <div className="card-page wordbook-empty">
            <span className="empty-icon is-success">
              <Icon name="check" size={26} strokeWidth={2.2} />
            </span>
            <h2>复习完成</h2>
            <p className="review-summary">
              本次共复习 <b className="num">{reviewQueue.length}</b> 词 · 认识{' '}
              <b className="num tone-good">{reviewResult.known}</b> · 不认识{' '}
              <b className="num tone-low">{reviewResult.unknown}</b>
            </p>
            <div className="review-rate">
              <div className="mastery-bar">
                <span style={{ width: `${rate}%` }} />
              </div>
              <span className="mastery-text">
                本次掌握率 <b className="num">{rate}%</b>
              </span>
            </div>
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
          <span>
            <Icon name="refresh" size={15} />
            生词复习 · 第 <b className="num">{reviewIndex + 1}</b> / {reviewQueue.length} 张
          </span>
          <button className="btn btn-sm" onClick={() => setReviewing(false)}>
            退出复习
          </button>
        </div>
        <div className="review-progress">
          <span style={{ width: `${(reviewIndex / reviewQueue.length) * 100}%` }} />
        </div>
        <div
          className={`card-3d ${reviewFlipped ? 'flipped' : ''}`}
          onClick={() => setReviewFlipped(!reviewFlipped)}
        >
          <div className="card-face card-front">
            <span className="card-level" style={{ background: '#f59e0b' }}>
              复习
            </span>
            <h2 className="card-word">{reviewCard.word}</h2>
            {reviewCard.phonetic && <p className="card-phonetic">{reviewCard.phonetic}</p>}
            <SpeakButton text={reviewCard.word} />
            <p className="card-hint">
              <Icon name="refresh" size={13} />
              先回忆释义，再点击卡片翻面对答案
            </p>
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
            <Icon name="close" size={16} />
            不认识
            <span className="btn-hint">稍后再复习</span>
          </button>
          <button className="btn btn-green" onClick={() => reviewMark(true)}>
            <Icon name="check" size={16} />
            认识
            <span className="btn-hint">间隔翻倍</span>
          </button>
        </div>
      </div>
    )
  }

  // ===== 空状态 =====
  if (list.length === 0) {
    return (
      <div className="card-page wordbook-empty">
        <span className="empty-icon">
          <Icon name="star" size={26} />
        </span>
        <h2>我的生词本</h2>
        <p className="muted">生词本还是空的。去「单词卡片」点击 ☆ 收藏不熟悉的单词吧。</p>
        <div className="empty-actions">
          <button className="btn btn-primary" onClick={() => onGo?.('cards')}>
            <Icon name="cards" size={16} />
            去背单词
          </button>
        </div>
      </div>
    )
  }

  // ===== 生词本列表 =====
  return (
    <div className="wordbook">
      <header className="wordbook-head">
        <div>
          <h2>我的生词本</h2>
          <p className="panel-sub">
            共 <b className="num">{list.length}</b> 个单词 · 待复习{' '}
            <b className="num">{dueCount}</b>
          </p>
        </div>
        <div className="wordbook-actions">
          <button
            className="btn btn-primary"
            onClick={startReview}
            disabled={dueCount === 0}
            title={dueCount === 0 ? '今天的复习任务都完成啦' : '开始间隔复习'}
          >
            <Icon name={dueCount === 0 ? 'check' : 'refresh'} size={16} />
            {dueCount === 0 ? '今日已复习完' : `开始复习 (${dueCount})`}
          </button>
          <button className="btn" onClick={exportWordbook} title="导出为 txt 文件">
            <Icon name="download" size={16} />
            导出
          </button>
        </div>
      </header>

      {/* 工具栏：搜索 + 筛选 */}
      <div className="wordbook-toolbar">
        <div className="search-wrap">
          <Icon name="search" size={17} className="search-icon" />
          <input
            className="wordbook-search"
            type="search"
            placeholder="搜索单词或释义…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="搜索生词本"
          />
        </div>
        <div className="wordbook-filters">
          <button
            className={`chip ${filter === 'all' ? 'chip-active' : ''}`}
            style={filter === 'all' ? { background: 'var(--primary)', color: '#fff' } : {}}
            onClick={() => setFilter('all')}
          >
            全部 <span className="chip-num">{list.length}</span>
          </button>
          <button
            className={`chip ${filter === 'core' ? 'chip-active' : ''}`}
            style={filter === 'core' ? { background: '#3b82f6', color: '#fff' } : {}}
            onClick={() => setFilter('core')}
          >
            精选 <span className="chip-num">{coreCount}</span>
          </button>
          <button
            className={`chip ${filter === 'cet6' ? 'chip-active' : ''}`}
            style={filter === 'cet6' ? { background: '#0d9488', color: '#fff' } : {}}
            onClick={() => setFilter('cet6')}
          >
            六级 <span className="chip-num">{cet6Count}</span>
          </button>
        </div>
      </div>

      <div className="wordbook-list">
        {filtered.map((w, i) => (
          <Reveal key={w.id} delay={Math.min(i, 8) * 45} className="wordbook-row">
            <div className="wordbook-item">
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
                <SpeakButton text={w.word} variant="sm" />
                <button
                  className="btn btn-sm"
                  onClick={() => toggleFavorite(w.id)}
                  title="从生词本移除"
                >
                  <Icon name="close" size={14} />
                  移除
                </button>
              </div>
            </div>
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <p className="empty">没有匹配「{search}」的单词</p>
        )}
      </div>
    </div>
  )
}
