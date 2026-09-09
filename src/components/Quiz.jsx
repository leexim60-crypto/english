import { useState, useEffect, useMemo, useRef } from 'react'
import { api } from '../api.js'
import { speak } from '../utils/speak.js'
import { recordReview, touchToday } from '../utils/review.js'

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
  return (
    <div className="quiz-stats">
      <div className="quiz-stats-title">📊 今日小测试 · 大家都在练</div>
      <div className="quiz-stats-row">
        <div className="quiz-stat">
          <span className="quiz-stat-num">{stats.attempts}</span>
          <span className="quiz-stat-label">挑战人次</span>
        </div>
        <div className="quiz-stat">
          <span className="quiz-stat-num">{stats.bestScore}</span>
          <span className="quiz-stat-label">最高分</span>
        </div>
        <div className="quiz-stat">
          <span className="quiz-stat-num">{stats.avgScore}</span>
          <span className="quiz-stat-label">平均分</span>
        </div>
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
        ⭐ 精选词库
      </button>
      <button
        className={`book-tab ${book === 'cet6' ? 'book-tab-active' : ''}`}
        onClick={() => {
          if (!started || finished) setBook('cet6')
        }}
        title={cet6Available ? '' : '需要后端在线'}
      >
        🎓 六级词库
      </button>
    </div>
  )

  if (!started) {
    return (
      <div className="quiz-start card-page">
        <h2>📝 单词测验</h2>
        {bookTabs}
        <p>
          共 {QUIZ_SIZE} 道选择题，看英文单词选出正确中文释义。
          {book === 'cet6' ? '（六级词库每次随机出题）' : '（精选词库每日题目固定）'}
        </p>
        <TodayStats stats={stats} />
        <button className="btn btn-primary btn-lg" onClick={start} disabled={loading}>
          {loading ? '出题中…' : '开始测验'}
        </button>
      </div>
    )
  }

  if (quiz.length === 0) {
    return (
      <div className="quiz-start card-page">
        <h2>📝 单词测验</h2>
        {loadError ? (
          <>
            <p className="muted">题目加载失败{book === 'cet6' && !cet6Available ? '：六级词库需要后端服务在线' : '，请稍后再试'}。</p>
            <button className="btn btn-primary" onClick={loadQuiz} disabled={loading}>
              {loading ? '加载中…' : '重新加载'}
            </button>
          </>
        ) : (
          <p className="muted">{loading ? '正在加载题目…' : '暂无可用题目，请稍后再试。'}</p>
        )}
      </div>
    )
  }

  if (finished) {
    const comment =
      accuracy >= 90 ? '🏆 太棒了，你是单词大师！'
      : accuracy >= 70 ? '👍 很不错，继续保持！'
      : accuracy >= 50 ? '💪 还行，多背背卡片吧～'
      : '📖 别灰心，去生词本复习一下吧！'
    return (
      <div className="quiz-result card-page">
        <h2>测验完成！</h2>
        <div className="score-circle">
          <span className="score-num">{score}</span>
          <span className="score-total">/ {quiz.length}</span>
        </div>
        <p className="score-accuracy">正确率 {accuracy}%</p>
        <p className="score-comment">{comment}</p>
        <TodayStats stats={stats} />
        <button className="btn btn-primary" onClick={start}>再来一次</button>
      </div>
    )
  }

  const q = quiz[Math.min(current, quiz.length - 1)]
  if (!q) return <p className="empty">题目加载中…</p>

  return (
    <div className="quiz">
      <div className="quiz-header">
        <span>第 {current + 1} / {quiz.length} 题 · {book === 'cet6' ? '六级词库' : '精选词库'}</span>
        <span>得分：{score}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((current + 1) / quiz.length) * 100}%` }} />
      </div>
      <p className="shortcut-hint">快捷键：1-4 选答案 · 回车 下一题</p>
      <div className="quiz-question card-page">
        <div className="quiz-word-row">
          <h2 className="quiz-word">{q.question.word}</h2>
          <button
            className="speak-btn speak-btn-inline"
            onClick={() => speak(q.question.word)}
            title="播放发音"
          >
            🔊
          </button>
          {selected === null ? (
            <button
              className={`fav-btn quiz-fav ${isFav(q.question.id) ? 'fav-active' : ''}`}
              onClick={() => favInQuiz(q)}
              title={isFav(q.question.id) ? '从生词本移除' : '加入生词本（并展示释义）'}
            >
              {isFav(q.question.id) ? '⭐' : '☆'}
            </button>
          ) : isFav(q.question.id) ? (
            <span className="quiz-fav-tag" title="已在生词本中">⭐ 已收藏</span>
          ) : null}
        </div>
        {q.question.phonetic && <p className="card-phonetic">{q.question.phonetic}</p>}
        {/* 答题前点 ☆ 收藏：立即展示汉译释义 */}
        {revealed && selected === null && (
          <div className="quiz-reveal">
            📌 已加入生词本 · <strong>{q.question.word}</strong>：{q.question.meaning}
          </div>
        )}
        <div className="quiz-options">
          {q.options.map((opt) => {
            let cls = 'quiz-option'
            if (selected !== null) {
              if (opt.id === q.answerId) cls += ' correct'
              else if (opt.id === selected) cls += ' wrong'
            }
            return (
              <button key={opt.id} className={cls} onClick={() => choose(opt.id)}>
                {opt.meaning}
              </button>
            )          })}
        </div>
        {selected !== null && (
          <div className="quiz-feedback">
            <p>
              {selected === q.answerId
                ? '✅ 回答正确！'
                : autoAdded.has(q.question.id)
                  ? `❌ 回答错误，已自动加入生词本 → ${q.question.meaning}`
                  : `❌ 正确答案：${q.question.meaning}`}
            </p>
            {q.question.example && (
              <>
                <p className="example-en">{q.question.example}</p>
                {q.question.exampleCn && <p className="example-cn">{q.question.exampleCn}</p>}
              </>
            )}
            <button className="btn btn-primary" onClick={goNext}>
              {current + 1 >= quiz.length ? '查看结果' : '下一题 →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
