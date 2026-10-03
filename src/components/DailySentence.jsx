import { useState, useMemo } from 'react'
import { getStreak, getDueIds } from '../utils/review.js'
import { lsGetJSON } from '../utils/storage.js'
import { PATTERN_STATS } from '../data/patterns.js'
import Icon from './Icons.jsx'
import CountUp from './CountUp.jsx'
import Reveal from './Reveal.jsx'
import SpeakButton from './SpeakButton.jsx'

const WEEK = ['日', '一', '二', '三', '四', '五', '六']

/** 最近 7 天打卡热力条（含今天，用于把"连续打卡"可视化） */
function buildWeek() {
  const log = lsGetJSON('studyLog', {}) || {}
  const out = []
  const p = (n) => String(n).padStart(2, '0')
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
    out.push({ key, label: WEEK[d.getDay()], done: !!log[key], today: i === 0 })
  }
  return out
}

export default function DailySentence({
  onGo,
  onReview,
  onHelp,
  onPatterns,
  onTranslate,
  sentences,
  counts,
  favorites,
}) {
  const today = new Date()
  // 每天固定推一句；「换一句」在当天的基础上往后翻，不写盘（次日自动回到当日句）
  const dayIndex = today.getFullYear() * 372 + today.getMonth() * 31 + today.getDate()
  const [offset, setOffset] = useState(0)
  const safeSentences = Array.isArray(sentences) && sentences.length > 0 ? sentences : []
  const sentenceTotal = safeSentences.length
  const pick = sentenceTotal > 0 ? (dayIndex + offset) % sentenceTotal : 0
  const sentence = sentenceTotal > 0 ? safeSentences[pick] : null

  const nextSentence = () => setOffset((o) => o + 1)

  const learned = lsGetJSON('learnedWords', [])
  const learnedCount = Array.isArray(learned) ? learned.length : 0
  const safeFavorites = Array.isArray(favorites) ? favorites : []
  const streak = getStreak()
  const dueCount = getDueIds(safeFavorites).length
  const week = buildWeek()

  const core = counts?.core || 0
  const cet6 = counts?.cet6 || 0
  const total = core + cet6
  const mastered = total ? Math.min(Math.round((learnedCount / total) * 100), 100) : 0

  const stats = [
    { icon: 'book', label: '词汇总量', value: total, sub: cet6 > 0 ? `含六级 ${cet6}` : '精选词库', color: 'var(--c-vocab)' },
    { icon: 'check', label: '已学习', value: learnedCount, sub: `掌握 ${mastered}%`, color: 'var(--c-learned)' },
    { icon: 'target', label: '待学习', value: Math.max(total - learnedCount, 0), sub: '保持节奏', color: 'var(--c-todo)' },
    { icon: 'flame', label: '连续打卡', value: streak, sub: '天', color: 'var(--c-streak)' },
  ]

  const dateText = today.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="home">
      {/* ================= Hero ================= */}
      <section className="hero">
        <Reveal variant="fade">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            {dateText} · 每日一句
          </span>
        </Reveal>

        <h1 className="hero-title">
          <span className="hero-line" style={{ '--i': 0 }}>
            <span className="hero-line-inner">每天进步</span>
          </span>
          <span className="hero-line" style={{ '--i': 1 }}>
            <span className="hero-line-inner hero-line-accent">
              一点点
              <Icon name="sparkle" size={30} className="hero-spark" strokeWidth={1.4} />
            </span>
          </span>
        </h1>

        <Reveal delay={200}>
          <p className="hero-sub">
            A little progress every day adds up to <em>big results.</em>
          </p>
        </Reveal>

        <Reveal delay={300} className="hero-cta">
          <button className="btn btn-primary btn-lg hero-cta-main" onClick={onGo}>
            开始背单词
            <Icon name="arrowRight" size={18} />
          </button>
          <button className="btn btn-lg btn-ghost" onClick={onHelp}>
            <Icon name="help" size={17} />
            使用手册
          </button>
        </Reveal>

        <Reveal delay={380} className="hero-meta">
          <span>
            <Icon name="cloud" size={14} /> 云端同步
          </span>
          <span className="meta-div" />
          <span>
            <Icon name="clock" size={14} /> 间隔复习
          </span>
          <span className="meta-div" />
          <span>
            <Icon name="speaker" size={14} /> 真人发音
          </span>
        </Reveal>
      </section>

      {/* ================= 每日一句 ================= */}
      {sentence && (
        <Reveal delay={80}>
          <section className="sentence-card">
            <div className="sentence-head">
              <span className="sentence-label">
                <Icon name="sparkle" size={13} /> Quote of the day
              </span>
              <div className="sentence-actions">
                {sentenceTotal > 1 && (
                  <button className="sentence-next" onClick={nextSentence} title="换一句">
                    <Icon name="refresh" size={14} />
                    换一句
                    <span className="sentence-count num">
                      {pick + 1}/{sentenceTotal}
                    </span>
                  </button>
                )}
                <SpeakButton text={sentence.en} variant="ghost" title="朗读整句" />
              </div>
            </div>
            <blockquote className="sentence-en">{sentence.en}</blockquote>
            <p className="sentence-cn">{sentence.cn}</p>
            {sentence.author && <p className="sentence-author">— {sentence.author}</p>}
          </section>
        </Reveal>
      )}

      {/* ================= 数据面板 ================= */}
      <Reveal delay={140}>
        <section className="panel">
          <header className="panel-head">
            <div>
              <h2 className="panel-title">学习进度</h2>
              <p className="panel-sub">Your learning at a glance</p>
            </div>
            <div className="week-strip" aria-label="最近七天打卡">
              {week.map((d) => (
                <div key={d.key} className={`week-day ${d.done ? 'is-done' : ''} ${d.today ? 'is-today' : ''}`}>
                  <span className="week-bar" />
                  <span className="week-label">{d.label}</span>
                </div>
              ))}
            </div>
          </header>

          <div className="stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 70} variant="up">
                <div className="stat-card" style={{ '--c': s.color }}>
                  <span className="stat-icon">
                    <Icon name={s.icon} size={19} />
                  </span>
                  <div className="stat-body">
                    <div className="stat-value num">
                      <CountUp value={s.value} />
                    </div>
                    <div className="stat-label">
                      {s.label}
                      {s.sub && <span className="stat-sub">{s.sub}</span>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mastery">
            <div className="mastery-bar">
              <span style={{ width: `${mastered}%` }} />
            </div>
            <span className="mastery-text">
              已掌握 <b className="num">{mastered}%</b> · {learnedCount} / {total}
            </span>
          </div>
        </section>
      </Reveal>

      {/* ================= 写作与翻译入口 ================= */}
      <Reveal delay={120}>
        <section className="module-grid">
          <button className="module-card" onClick={onPatterns}>
            <span className="module-icon">
              <Icon name="sparkle" size={20} />
            </span>
            <span className="module-body">
              <span className="module-title">高分句型</span>
              <span className="module-desc">
                {PATTERN_STATS.total} 个作文句式（含 {PATTERN_STATS.expert} 个很高级结构），
                标注使用场景、易错点与「平庸 → 高分」对照
              </span>
            </span>
            <Icon name="arrowRight" size={17} className="module-arrow" />
          </button>

          <button className="module-card" onClick={onTranslate}>
            <span className="module-icon">
              <Icon name="book" size={20} />
            </span>
            <span className="module-body">
              <span className="module-title">翻译练习</span>
              <span className="module-desc">历年真题 + 热点预测，附难点拆解与降级表达</span>
            </span>
            <Icon name="arrowRight" size={17} className="module-arrow" />
          </button>
        </section>
      </Reveal>

      {/* ================= 待复习提醒 ================= */}
      {safeFavorites.length > 0 && (
        <Reveal delay={80}>
          <section className={`due-card ${dueCount === 0 ? 'is-clear' : ''}`}>
            <span className="due-icon">
              <Icon name={dueCount === 0 ? 'check' : 'refresh'} size={20} />
            </span>
            <div className="due-text">
              {dueCount > 0 ? (
                <>
                  生词本里有 <strong className="num">{dueCount}</strong> 个词到了复习时间
                  <span className="due-hint">趁记忆还热，花两分钟巩固一下</span>
                </>
              ) : (
                <>
                  今日复习任务已完成
                  <span className="due-hint">明天再来，记忆曲线会帮你留住它们</span>
                </>
              )}
            </div>
            <button className="btn btn-primary" onClick={onReview}>
              去复习
              <Icon name="arrowRight" size={16} />
            </button>
          </section>
        </Reveal>
      )}
    </div>
  )
}
