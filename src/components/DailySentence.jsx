import { getStreak, getDueIds } from '../utils/review.js'
import { speak } from '../utils/speak.js'

export default function DailySentence({ onGo, onReview, onHelp, sentences, counts, favorites }) {
  // 根据日期选择"每日一句"
  const today = new Date()
  const index = today.getFullYear() * 372 + today.getMonth() * 31 + today.getDate()
  const safeSentences = Array.isArray(sentences) && sentences.length > 0 ? sentences : []
  const sentence =
    safeSentences.length > 0 ? safeSentences[index % safeSentences.length] : null

  const learned = (() => {
    try {
      return JSON.parse(localStorage.getItem('learnedWords') || '[]')
    } catch {
      return []
    }
  })()

  const safeFavorites = Array.isArray(favorites) ? favorites : []
  const streak = getStreak()
  const dueCount = getDueIds(safeFavorites).length

  const core = counts?.core || 0
  const cet6 = counts?.cet6 || 0
  const total = core + cet6
  const stats = [
    { label: cet6 > 0 ? `词汇总量（含六级 ${cet6}）` : '词汇总量', value: total, color: '#3b82f6' },
    { label: '已学习', value: learned.length, color: '#22c55e' },
    { label: '待学习', value: Math.max(total - learned.length, 0), color: '#f59e0b' },
    { label: `连续打卡${streak > 0 ? ' 🔥' : ''}`, value: `${streak} 天`, color: '#8b5cf6' },
  ]

  return (
    <div className="home">
      <section className="hero">
        <h1>每天进步一点点</h1>
        <p className="hero-sub">A little progress every day adds up to big results.</p>
        <button className="btn btn-primary btn-lg" onClick={onGo}>
          🚀 开始背单词
        </button>
        <button className="btn hero-help" onClick={onHelp}>
          ❓ 使用手册
        </button>
      </section>

      {sentence && (
        <section className="sentence-card">
          <div className="sentence-label">📅 每日一句 · {today.toLocaleDateString('zh-CN')}</div>
          <p className="sentence-en">
            “{sentence.en}”
            <button
              className="speak-btn speak-btn-inline speak-btn-on-dark"
              onClick={() => speak(sentence.en)}
              title="朗读整句"
            >
              🔊
            </button>
          </p>
          <p className="sentence-cn">{sentence.cn}</p>
          <p className="sentence-author">—— {sentence.author}</p>
        </section>
      )}

      <section className="stats">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {safeFavorites.length > 0 && (
        <section className="due-card">
          <span>
            🔁 生词本里有 <strong>{dueCount}</strong> 个词到了复习时间
            {dueCount === 0 && '，今日任务已完成 ✓'}
          </span>
          <button className="btn btn-primary" onClick={onReview}>
            去复习 →
          </button>
        </section>
      )}
    </div>
  )
}
