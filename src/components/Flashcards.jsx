import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { api } from '../api.js'
import { speak } from '../utils/speak.js'
import { recordReview, touchToday } from '../utils/review.js'

const LEVEL_NAMES = { 1: '基础', 2: '进阶', 3: '高阶' }
const LEVEL_COLORS = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' }

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Flashcards({ words, counts, source, favorites, toggleFavorite }) {
  // book: 'core' 精选词库（本地/数据库全量） | 'cet6' 六级词库（后端随机流）
  const [book, setBook] = useState('core')
  const [level, setLevel] = useState(1)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  // 刚标记"不认识"：翻转展示释义，停在当前卡片等待用户主动继续
  const [unknownRevealed, setUnknownRevealed] = useState(false)
  const [learned, setLearned] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('learnedWords') || '[]')
    } catch {
      return []
    }
  })

  // ===== 六级随机流状态 =====
  const [queue, setQueue] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [streamError, setStreamError] = useState(false)
  const fetchingRef = useRef(false)
  const learnedSet = useMemo(() => new Set(learned), [learned])

  const safeWords = Array.isArray(words) ? words : []
  const coreList = useMemo(
    () => safeWords.filter((w) => w.level === level),
    [safeWords, level]
  )
  const cet6Total = counts?.cet6 || 0
  const cet6Available = source === 'server' && cet6Total > 0

  const loadBatch = useCallback(async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoadingMore(true)
    setStreamError(false)
    try {
      const data = await api.getRandomWords('cet6', 50)
      if (Array.isArray(data.words) && data.words.length > 0) {
        setQueue((q) => [...q, ...shuffle(data.words)])
      } else {
        setStreamError(true)
      }
    } catch {
      setStreamError(true)
    } finally {
      fetchingRef.current = false
      setLoadingMore(false)
    }
  }, [])

  // 切到六级模式时加载第一批；切回精选时清空队列
  useEffect(() => {
    if (book === 'cet6') {
      setQueue([])
      setIndex(0)
      setFlipped(false)
      setUnknownRevealed(false)
      loadBatch()
    } else {
      setQueue([])
      setIndex(0)
      setFlipped(false)
      setUnknownRevealed(false)
    }
  }, [book]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveLearned = (next) => {
    setLearned(next)
    localStorage.setItem('learnedWords', JSON.stringify(next))
    touchToday()
  }

  const mark = (known) => {
    const card = book === 'core' ? coreList[index] : queue[index]
    if (!card) return
    if (known) {
      if (!learned.includes(card.id)) saveLearned([...learned, card.id])
      recordReview(card.id, true)
      next()
    } else {
      if (learned.includes(card.id)) saveLearned(learned.filter((i) => i !== card.id))
      // 不认识：自动加入生词本（已在生词本里的不重复操作）
      if (!favorites.includes(card.id)) toggleFavorite(card.id)
      recordReview(card.id, false)
      // 翻转卡片展示汉译释义，停在当前词等用户看完再继续
      setFlipped(true)
      setUnknownRevealed(true)
      speak(card.word)
    }
  }

  const next = () => {
    setFlipped(false)
    setUnknownRevealed(false)
    setTimeout(() => {
      if (book === 'core') {
        setIndex((i) => (i + 1) % coreList.length)
      } else {
        setIndex((i) => i + 1)
      }
    }, 150)
  }

  const prev = () => {
    setFlipped(false)
    setUnknownRevealed(false)
    setTimeout(() => {
      if (book === 'core') {
        setIndex((i) => (i - 1 + coreList.length) % coreList.length)
      } else {
        setIndex((i) => Math.max(i - 1, 0))
      }
    }, 150)
  }

  // 卡片正面点 ☆ 收藏：同样立即翻面展示释义
  const favFromFront = () => {
    if (!card) return
    if (!isFav) {
      toggleFavorite(card.id)
      recordReview(card.id, false)
      setFlipped(true)
      setUnknownRevealed(true)
    } else {
      toggleFavorite(card.id)
    }
  }

  // 六级模式：临近队尾时预加载下一批，保证无缝
  useEffect(() => {
    if (book === 'cet6' && queue.length > 0 && index >= queue.length - 5 && !loadingMore) {
      loadBatch()
    }
  }, [index, queue.length, book, loadingMore, loadBatch])

  const card = book === 'core' ? coreList[Math.min(index, Math.max(coreList.length - 1, 0))] : queue[index]
  const isFav = card && favorites.includes(card.id)

  // ===== 键盘快捷键：空格翻面 · ← → 切换 · ↑ 认识 · ↓ 不认识 =====
  const keyHandlerRef = useRef(null)
  keyHandlerRef.current = (e) => {
    if (!card) return
    const tag = (e.target.tagName || '').toUpperCase()
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if (e.code === 'Space') {
      e.preventDefault()
      setFlipped((f) => !f)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      mark(true)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      mark(false)
    }
  }
  useEffect(() => {
    const onKey = (e) => keyHandlerRef.current && keyHandlerRef.current(e)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ===== 六级模式不可用（后端离线） =====
  if (book === 'cet6' && !cet6Available) {
    return (
      <div className="flashcards">
        <div className="book-tabs">
          <BookTab active={book === 'core'} onClick={() => setBook('core')}>⭐ 精选词库</BookTab>
          <BookTab active={book === 'cet6'} onClick={() => setBook('cet6')}>🎓 六级词库</BookTab>
        </div>
        <div className="card-page wordbook-empty">
          <h2>🎓 六级词库</h2>
          <p className="muted">六级词库存储在服务器数据库中，需要后端服务在线。</p>
          <p className="muted">请先启动后端（server 目录 npm start），再切换到六级词库。</p>
          <button className="btn btn-primary" onClick={() => setBook('core')}>
            返回精选词库
          </button>
        </div>
      </div>
    )
  }

  // ===== 六级模式加载中 / 出错 =====
  if (book === 'cet6' && queue.length === 0) {
    return (
      <div className="flashcards">
        <div className="book-tabs">
          <BookTab active={book === 'core'} onClick={() => setBook('core')}>⭐ 精选词库</BookTab>
          <BookTab active={book === 'cet6'} onClick={() => setBook('cet6')}>🎓 六级词库</BookTab>
        </div>
        <div className="card-page wordbook-empty">
          <h2>🎓 六级词库</h2>
          {streamError ? (
            <>
              <p className="muted">题目加载失败，请检查网络后重试。</p>
              <button className="btn btn-primary" onClick={loadBatch}>重新加载</button>
            </>
          ) : (
            <p className="muted">正在加载单词…</p>
          )}
        </div>
      </div>
    )
  }

  if (book === 'core' && !card) {
    return <p className="empty">该级别暂无单词</p>
  }
  if (!card) return <p className="empty">单词加载中…</p>

  // ===== 进度信息 =====
  let progressInfo
  if (book === 'core') {
    const learnedInLevel = coreList.filter((w) => learned.includes(w.id)).length
    const progress = coreList.length ? Math.round((learnedInLevel / coreList.length) * 100) : 0
    progressInfo = (
      <>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">
          本级别已掌握 {progress}%（{learnedInLevel}/{coreList.length}）
        </p>
      </>
    )
  } else {
    progressInfo = (
      <p className="progress-text">
        六级词库共 {cet6Total} 词 · 已掌握 {learned.length} 词 · 随机出卡
      </p>
    )
  }

  return (
    <div className="flashcards">
      {/* 词书切换 */}
      <div className="book-tabs">
        <BookTab active={book === 'core'} onClick={() => setBook('core')}>⭐ 精选词库</BookTab>
        <BookTab active={book === 'cet6'} onClick={() => setBook('cet6')}>🎓 六级词库</BookTab>
      </div>

      {/* 精选词库显示难度级别；六级词库为随机流 */}
      {book === 'core' && (
        <div className="level-tabs">
          {[1, 2, 3].map((l) => (
            <button
              key={l}
              className={`chip ${level === l ? 'chip-active' : ''}`}
              style={level === l ? { background: LEVEL_COLORS[l], color: '#fff' } : {}}
              onClick={() => {
                setLevel(l)
                setIndex(0)
                setFlipped(false)
                setUnknownRevealed(false)
              }}
            >
              {LEVEL_NAMES[l]} ({safeWords.filter((w) => w.level === l).length}词)
            </button>
          ))}
        </div>
      )}

      {progressInfo}

      {/* 标记"不认识"后：提示已入生词本，汉译已展示 */}
      {unknownRevealed && (
        <div className="unknown-banner">
          📌 已加入生词本，汉译释义已翻面展示 · 记住后按「下一个」或 → 继续
        </div>
      )}

      <div className={`card-3d ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="card-face card-front">
          <span
            className="card-level"
            style={{
              background: book === 'cet6' ? '#8b5cf6' : LEVEL_COLORS[card.level] || '#3b82f6',
            }}
          >
            {book === 'cet6' ? '六级' : LEVEL_NAMES[card.level] || '基础'}
          </span>
          <h2 className="card-word">{card.word}</h2>
          {card.phonetic && <p className="card-phonetic">{card.phonetic}</p>}
          <button
            className="speak-btn"
            onClick={(e) => {
              e.stopPropagation()
              speak(card.word)
            }}
            onTouchEnd={(e) => e.stopPropagation()}
            title="播放发音"
          >
            🔊
          </button>
          <p className="card-hint">点击卡片查看释义 · 空格键翻面</p>
          <button
            className={`fav-btn ${isFav ? 'fav-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              favFromFront()
            }}
            title={isFav ? '从生词本移除' : '加入生词本（并展示释义）'}
          >
            {isFav ? '⭐' : '☆'}
          </button>
        </div>
        <div className="card-face card-back">
          <h3 className="card-meaning">{card.meaning}</h3>
          {card.example && (
            <div className="card-example">
              <p className="example-en">{card.example}</p>
              {card.exampleCn && <p className="example-cn">{card.exampleCn}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="card-controls">
        <button className="btn" onClick={prev} disabled={book === 'cet6' && index === 0}>
          ← 上一个
        </button>
        <button
          className="btn btn-red"
          onClick={() => mark(false)}
          title="不认识：自动加入生词本并翻面展示释义"
        >
          😕 不认识
        </button>
        <button className="btn btn-green" onClick={() => mark(true)}>
          😀 认识{book === 'cet6' && learnedSet.has(card.id) ? ' ✓' : ''}
        </button>
        <button className="btn" onClick={next}>下一个 →</button>
      </div>
      <p className="progress-text">
        {book === 'core'
          ? `${Math.min(index, coreList.length - 1) + 1} / ${coreList.length}`
          : `第 ${index + 1} 张${loadingMore ? ' · 加载中…' : ''}`}
      </p>
      <p className="shortcut-hint">快捷键：空格 翻面 · ← → 切换 · ↑ 认识 · ↓ 不认识</p>
    </div>
  )
}

function BookTab({ active, onClick, children }) {
  return (
    <button className={`book-tab ${active ? 'book-tab-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
