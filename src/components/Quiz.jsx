import { useState, useEffect, useMemo, useRef } from 'react'
import { api } from '../api.js'
import { speak } from '../utils/speak.js'
import { recordReview, touchToday } from '../utils/review.js'
import { toast } from '../utils/toast.js'
import Icon from './Icons.jsx'
import SpeakButton from './SpeakButton.jsx'
import ProgressRing from './ProgressRing.jsx'

const QUIZ_SIZE = 10

// ===== 本地兜底：后端不可用时用传入的词库现场出题 =====
function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildLocalQuiz(words) {
  if (!Array.isArray(words) || words.length < 4) return []
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const picked = seededShuffle(words, seed).slice(0, QUIZ_SIZE)
  return picked.map((w) => {
    const wrong = words
      .filter((o) => o.id !== w.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    const options = seededShuffle([...wrong, w], seed + w.id).map((o) => ({
      id: o.id,
      meaning: o.meaning,
    }))
    return {
      question: {
        id: w.id,
        word: w.word,
        phonetic: w.phonetic,
        example: w.example,
        exampleCn: w.exampleCn,
        meaning: w.meaning,
      },
      options,
      answerId: w.id,
    }
  })
}

// ===== 今日小测试统计面板（Redis 数据） =====
function TodayStats({ stats }) {
  if (!stats) return null
  const items = [
    { num: stats.attempts, label: '挑战人次', icon: 'trend' },
    { num: stats.bestScore, label: '最高分', icon: 'target' },
    { num: stats.avgScore, label: '平均分', icon: 'clock' },
  ]
  return (
    <div className="quiz-stats">
      <div className="quiz-stats-title">
        <Icon name="trend" size={15} />
        今日小测试 · 大家都在练
      </div>
      <div className="quiz-stats-row">
        {items.map((it) => (
          <div className="quiz-stat" key={it.label}>
            <span className="quiz-stat-num num">{it.num}</span>
            <span className="quiz-stat-label">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Quiz({ words, source, favorites, toggleFavorite }) {
  const [book, setBook] = useState('core')
  const [started, setStarted] = useState(false)
  const [quiz, setQuiz] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [stats, setStats] = useState(null)
  const submittedRef = useRef(false)

  const safeFavorites = Array.isArray(favorites) ? favorites : []
  const isFav = (id) => safeFavorites.includes(id)
  // 本次测验中自动加入生词本的记录（避免重复提示）
  const [autoAdded, setAutoAdded] = useState(new Set())
  // 点 ☆ 主动收藏后立即展示释义（用户要求：收藏进生词本就显示汉译）
  const [revealed, setRevealed] = useState(false)

  const cet6Available = source === 'server'

  // 进入页面 / 切换词书时拉取今日统计
  useEffect(() => {
    let cancelled = false
    setStats(null)
    api
      .getQuizStats(book)
      .then((data) => {
        if (!cancelled && data && typeof data.attempts === 'number') setStats(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [book])

  // 拉取测验题；精选词库失败时用本地词库兜底，六级词库失败提示重试
  const loadQuiz = async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const data = await api.getDailyQuiz(book)
      if (!Array.isArray(data.quiz) || data.quiz.length === 0) throw new Error('empty')
      setQuiz(data.quiz)
    } catch {
      if (book === 'core') {
        setQuiz(buildLocalQuiz(words))
      } else {
        setQuiz([])
        setLoadError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const start = async () => {
    submittedRef.current = false
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setAutoAdded(new Set())
    setRevealed(false)
    setStarted(true)
    await loadQuiz()
  }

  const choose = (id) => {
    if (selected !== null || !quiz[current]) return
    setSelected(id)
    const q = quiz[current]
    if (id === q.answerId) {
      setScore((s) => s + 1)
    } else {
      // 选错：自动加入生词本，并记录复习调度（立即待复习）
      if (!isFav(q.question.id)) {
        toggleFavorite(q.question.id)
        setAutoAdded((prev) => new Set(prev).add(q.question.id))
      }
      recordReview(q.question.id, false)
    }
    speak(q.question.word)
  }

  // 答题前点 ☆ 收藏：加入生词本 + 立即展示释义 + 记录待复习
  const favInQuiz = (q) => {
    const wasFav = isFav(q.question.id)
    toggleFavorite(q.question.id)
    if (!wasFav) {
      recordReview(q.question.id, false)
      setRevealed(true)
      speak(q.question.word)
    }
  }

  const goNext = () => {
    if (current + 1 >= quiz.length) {
      setFinished(true)
      touchToday()
      // 提交成绩到后端（MySQL 持久化 + Redis 统计），失败不影响 UI
      if (!submittedRef.current) {
        submittedRef.current = true
        api
          .submitQuiz(score, quiz.length, book)
          .then((data) => {
            if (data && typeof data.attempts === 'number') setStats(data)
          })
          .catch(() => {})
      }
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  // ===== 键盘快捷键：1-4 选答案 · 回车/空格 下一题 =====
  const keyHandlerRef = useRef(null)
  keyHandlerRef.current = (e) => {
    const q = quiz[Math.min(current, quiz.length - 1)]
    if (!q) return
    const tag = (e.target.tagName || '').toUpperCase()
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if (selected === null && /^[1-4]$/.test(e.key)) {
      const opt = q.options[Number(e.key) - 1]
      if (opt) choose(opt.id)
    } else if (selected !== null && (e.key === 'Enter' || e.code === 'Space')) {
      e.preventDefault()
      goNext()
    }
  }
  useEffect(() => {
    const onKey = (e) => keyHandlerRef.current && keyHandlerRef.current(e)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const accuracy = useMemo(
    () => (quiz.length ? Math.round((score / quiz.length) * 100) : 0),
    [score, quiz.length]
  )

  const bookTabs = (
    <div className="book-tabs">
      <button
        className={`book-tab ${book === 'core' ? 'book-tab-active' : ''}`}
        onClick={() => {
          if (!started || finished) setBook('core')
        }}
      >
        <Icon name="star" size={15} />
        精选词库
      </button>
      <button
        className={`book-tab ${book === 'cet6' ? 'book-tab-active' : ''}`}
        onClick={() => {
          if (!started || finished) setBook('cet6')
        }}
        title={cet6Available ? '' : '需要后端在线'}
      >
        <Icon name="book" size={15} />
        六级词库
      </button>
    </div>
  )

  if (!started) {
    return (
      <div className="quiz-start card-page">
        <span className="empty-icon">
          <Icon name="quiz" size={26} />
        </span>
        <h2>单词测验</h2>
        {bookTabs}
        <p className="quiz-start-desc">
          共 <b className="num">{QUIZ_SIZE}</b> 道选择题，看英文单词选出正确中文释义。
          {book === 'cet6' ? '（六级词库每次随机出题）' : '（精选词库每日题目固定）'}
        </p>
        <TodayStats stats={stats} />
        <button className="btn btn-primary btn-lg" onClick={start} disabled={loading}>
          {loading ? '出题中…' : '开始测验'}
          {!loading && <Icon name="arrowRight" size={18} />}
        </button>
      </div>
    )
  }

  if (quiz.length === 0) {
    return (
      <div className="quiz-start card-page">
        <span className="empty-icon">
          <Icon name="quiz" size={26} />
        </span>
        <h2>单词测验</h2>
        {loadError ? (
          <>
            <p className="muted">题目加载失败{book === 'cet6' && !cet6Available ? '：六级词库需要后端服务在线' : '，请稍后再试'}。</p>
            <button className="btn btn-primary" onClick={loadQuiz} disabled={loading}>
              {loading ? '加载中…' : '重新加载'}
            </button>
          </>
        ) : (
          loading ? (
            <div className="sk-list" style={{ marginTop: 18 }}>
              <div className="sk sk-word" style={{ height: 34, width: 180, margin: '0 auto 6px' }} />
              <div className="sk sk-line" style={{ height: 52 }} />
              <div className="sk sk-line" style={{ height: 52 }} />
              <div className="sk sk-line" style={{ height: 52 }} />
              <div className="sk sk-line" style={{ height: 52 }} />
            </div>
          ) : (
            <p className="muted">暂无可用题目，请稍后再试。</p>
          )
        )}
      </div>
    )
  }

  if (finished) {
    const tier =
      accuracy >= 90
        ? { text: '太棒了，你是单词大师！', icon: 'sparkle', tone: 'great' }
        : accuracy >= 70
          ? { text: '很不错，继续保持！', icon: 'check', tone: 'good' }
          : accuracy >= 50
            ? { text: '还行，多背背卡片吧～', icon: 'trend', tone: 'ok' }
            : { text: '别灰心，去生词本复习一下吧！', icon: 'book', tone: 'low' }

    // 一键复制成绩，方便打卡分享
    const copyResult = async () => {
      const text = `英语学习网 · 今日单词测验\n得分：${score}/${quiz.length}（正确率 ${accuracy}%）\n${tier.text}`
      try {
        await navigator.clipboard.writeText(text)
        toast('成绩已复制，去分享吧 🎉', 'success')
      } catch {
        toast('复制失败，请手动长按选择 📋', 'error')
      }
    }

    return (
      <div className={`quiz-result card-page tone-${tier.tone}`}>
        <h2>测验完成</h2>
        <ProgressRing value={accuracy} size={158} stroke={10} gradientId="quizRing">
          <span className="ring-value ring-value-lg num">{score}</span>
          <span className="ring-sub">/ {quiz.length} 题</span>
        </ProgressRing>
        <p className="score-accuracy">
          正确率 <b className="num">{accuracy}%</b>
        </p>
        <p className="score-comment">
          <Icon name={tier.icon} size={17} />
          {tier.text}
        </p>
        <TodayStats stats={stats} />
        <div className="result-actions">
          <button className="btn btn-primary" onClick={start}>
            <Icon name="refresh" size={16} />
            再来一次
          </button>
          <button className="btn" onClick={copyResult} title="复制成绩到剪贴板">
            <Icon name="download" size={16} />
            复制成绩
          </button>
        </div>
      </div>
    )
  }

  const q = quiz[Math.min(current, quiz.length - 1)]
  if (!q) return <p className="empty">题目加载中…</p>

  return (
    <div className="quiz">
      <div className="quiz-header">
        <span className="quiz-header-left">
          第 <b className="num">{current + 1}</b> / {quiz.length} 题
          <span className="quiz-header-div" />
          {book === 'cet6' ? '六级词库' : '精选词库'}
        </span>
        <span className="quiz-header-score">
          得分 <b className="num">{score}</b>
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((current + 1) / quiz.length) * 100}%` }} />
      </div>
      <div className="quiz-question card-page">
        <div className="quiz-word-row">
          <h2 className="quiz-word">{q.question.word}</h2>
          <SpeakButton text={q.question.word} variant="sm" />
          {selected === null ? (
            <button
              className={`fav-btn quiz-fav ${isFav(q.question.id) ? 'fav-active' : ''}`}
              onClick={() => favInQuiz(q)}
              title={isFav(q.question.id) ? '从生词本移除' : '加入生词本（并展示释义）'}
              aria-label={isFav(q.question.id) ? '从生词本移除' : '加入生词本'}
            >
              <Icon
                name="star"
                size={20}
                strokeWidth={isFav(q.question.id) ? 0 : 1.7}
                fill={isFav(q.question.id) ? 'currentColor' : 'none'}
              />
            </button>
          ) : isFav(q.question.id) ? (
            <span className="quiz-fav-tag" title="已在生词本中">
              <Icon name="star" size={13} fill="currentColor" strokeWidth={0} />
              已收藏
            </span>
          ) : null}
        </div>
        {q.question.phonetic && <p className="card-phonetic">{q.question.phonetic}</p>}
        {/* 答题前点 ☆ 收藏：立即展示汉译释义 */}
        {revealed && selected === null && (
          <div className="quiz-reveal">
            <Icon name="star" size={15} />
            已加入生词本 · <strong>{q.question.word}</strong>：{q.question.meaning}
          </div>
        )}
        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option'
            if (selected !== null) {
              if (opt.id === q.answerId) cls += ' correct'
              else if (opt.id === selected) cls += ' wrong'
            }
            const state =
              selected === null
                ? null
                : opt.id === q.answerId
                  ? 'correct'
                  : opt.id === selected
                    ? 'wrong'
                    : null
            return (
              <button
                key={opt.id}
                className={cls}
                onClick={() => choose(opt.id)}
                disabled={selected !== null}
              >
                <span className="opt-letter">
                  {state === 'correct' ? (
                    <Icon name="check" size={15} strokeWidth={2.4} />
                  ) : state === 'wrong' ? (
                    <Icon name="close" size={15} strokeWidth={2.4} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="opt-text">{opt.meaning}</span>
                {state && (
                  <span className="opt-state">
                    {state === 'correct' ? '正确答案' : '你的选择'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {selected !== null && (
          <div className="quiz-feedback">
            <p className="feedback-line">
              {selected === q.answerId ? (
                <>
                  <Icon name="check" size={16} /> 回答正确！
                </>
              ) : autoAdded.has(q.question.id) ? (
                <>
                  <Icon name="close" size={16} /> 回答错误，已自动加入生词本 → {q.question.meaning}
                </>
              ) : (
                <>
                  <Icon name="close" size={16} /> 正确答案：{q.question.meaning}
                </>
              )}
            </p>
            {q.question.example && (
              <div className="feedback-example">
                <p className="example-en">{q.question.example}</p>
                {q.question.exampleCn && <p className="example-cn">{q.question.exampleCn}</p>}
              </div>
            )}
            <button className="btn btn-primary" onClick={goNext}>
              {current + 1 >= quiz.length ? '查看结果' : '下一题'}
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="shortcut-hint">
        <kbd>1</kbd>–<kbd>4</kbd> 选答案 · <kbd>回车</kbd> 下一题
      </p>
    </div>
  )
}
