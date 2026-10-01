import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { translations, TOPICS, TOPIC_NAMES } from '../data/translations.js'
import { lsGetJSON, lsSet } from '../utils/storage.js'
import { toast } from '../utils/toast.js'
import Icon from './Icons.jsx'
import Reveal from './Reveal.jsx'

const SOURCE_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'exam', label: '历年真题' },
  { key: 'predicted', label: '预测题' },
]

/** 简易词数统计：按空白切分 */
function countWords(text) {
  const t = (text || '').trim()
  if (!t) return 0
  return t.split(/\s+/).length
}

/**
 * 翻译练习（汉译英）
 * ---------------------------------------------------------------
 * 流程：读中文原文 → 自己动手译 → 对照参考译文 → 看难点拆解与降级表达。
 * 难点拆解说明"难在哪、为什么难、怎么处理"；
 * 降级表达给出"写不出高级结构时的保底方案"，强调得分优先。
 */
export default function Translation() {
  const [topic, setTopic] = useState('all')
  const [source, setSource] = useState('all')
  const [openId, setOpenId] = useState(null)

  // 用户译文草稿（按题目 id 保存，刷新不丢）
  const [drafts, setDrafts] = useState(() => lsGetJSON('translationDrafts', {}))
  const [done, setDone] = useState(() => lsGetJSON('translationDone', []))
  const saveTimer = useRef(null)

  const doneSet = useMemo(() => new Set(done), [done])

  useEffect(() => () => clearTimeout(saveTimer.current), [])

  const updateDraft = useCallback(
    (id, value) => {
      setDrafts((prev) => {
        const next = { ...prev, [id]: value }
        // 防抖落盘，避免每次按键都写 localStorage
        clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => lsSet('translationDrafts', next), 500)
        return next
      })
    },
    []
  )

  const markDone = useCallback((id) => {
    setDone((prev) => {
      const has = prev.includes(id)
      const next = has ? prev.filter((i) => i !== id) : [...prev, id]
      lsSet('translationDone', next)
      toast(has ? '已取消完成标记' : '已标记完成 ✓', has ? 'info' : 'success', 1400)
      return next
    })
  }, [])

  const list = useMemo(
    () =>
      translations.filter((t) => {
        if (topic !== 'all' && t.topic !== topic) return false
        if (source !== 'all' && t.source !== source) return false
        return true
      }),
    [topic, source]
  )

  const examCount = translations.filter((t) => t.source === 'exam').length
  const predictedCount = translations.length - examCount

  return (
    <div className="translation">
      <header className="page-head">
        <div className="page-head-main">
          <h2 className="page-title">
            <Icon name="book" size={24} />
            翻译练习
          </h2>
          <p className="page-desc">
            四六级汉译英 · 先自己动笔，再对照参考译文。<b>难点拆解</b>告诉你卡在哪，
            <b>降级表达</b>给你写不出高级结构时的保底方案。
          </p>
        </div>
        <div className="page-head-stat">
          <span className="stat-value num">{done.length}</span>
          <span className="stat-label">/ {translations.length} 已完成</span>
        </div>
      </header>

      {/* ===== 筛选 ===== */}
      <div className="filters">
        <div className="seg-tabs">
          {SOURCE_FILTERS.map((s) => (
            <button
              key={s.key}
              className={`seg-tab ${source === s.key ? 'is-active' : ''}`}
              onClick={() => setSource(s.key)}
            >
              {s.label}
              <span className="chip-num">
                {s.key === 'all' ? translations.length : s.key === 'exam' ? examCount : predictedCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="cat-scroll" role="tablist" aria-label="话题分类">
        {TOPICS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={topic === t.key}
            className={`cat-chip ${topic === t.key ? 'is-active' : ''}`}
            onClick={() => setTopic(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== 题目列表 ===== */}
      {list.length === 0 ? (
        <p className="empty">该筛选下暂无题目</p>
      ) : (
        <div className="tr-list">
          {list.map((item, i) => {
            const open = openId === item.id
            const isDone = doneSet.has(item.id)
            const draft = drafts[item.id] || ''
            const words = countWords(draft)

            return (
              <Reveal key={item.id} delay={Math.min(i, 6) * 50} className="tr-row">
                <article className={`tr-card ${open ? 'is-open' : ''} ${isDone ? 'is-done' : ''}`}>
                  {/* 头部 */}
                  <button
                    className="tr-head"
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={open}
                  >
                    <span className="tr-head-left">
                      <span className={`tr-badge ${item.source === 'exam' ? 'is-exam' : 'is-predicted'}`}>
                        {item.source === 'exam' ? item.year : '预测'}
                      </span>
                      <span className="tr-title">{item.title}</span>
                    </span>
                    <span className="tr-head-right">
                      <span className={`tr-level tr-level-${item.level}`}>
                        {item.level === 'cet6' ? '六级' : '四级'}
                      </span>
                      <span className="tr-topic">{TOPIC_NAMES[item.topic]}</span>
                      {isDone && (
                        <span className="tr-done">
                          <Icon name="check" size={13} strokeWidth={2.6} />
                        </span>
                      )}
                      <span className="pattern-toggle" aria-hidden="true">
                        <Icon name="arrowRight" size={16} />
                      </span>
                    </span>
                  </button>

                  {open && (
                    <div className="tr-body">
                      {/* 中文原文 */}
                      <section className="tr-section">
                        <h4 className="tr-section-title">
                          <span className="tr-num">1</span>
                          中文原文
                          {item.set && <span className="tr-set">{item.set}</span>}
                        </h4>
                        <p className="tr-cn">{item.cn}</p>
                      </section>

                      {/* 自己翻译 */}
                      <section className="tr-section">
                        <h4 className="tr-section-title">
                          <span className="tr-num">2</span>
                          你的译文
                          <span className="tr-words">
                            {words > 0 ? `${words} words` : '建议 120–180 词'}
                          </span>
                        </h4>
                        <textarea
                          className="tr-input"
                          value={draft}
                          onChange={(e) => updateDraft(item.id, e.target.value)}
                          placeholder="先不要看答案，自己写一遍。写不出的地方可以用简单句保底，意思到位比句式漂亮更重要。"
                          spellCheck={false}
                          rows={5}
                        />
                        {draft && (
                          <div className="tr-input-foot">
                            <button
                              className="btn btn-sm"
                              onClick={() => {
                                updateDraft(item.id, '')
                                toast('已清空译文', 'info', 1200)
                              }}
                            >
                              <Icon name="close" size={13} />
                              清空
                            </button>
                          </div>
                        )}
                      </section>

                      {/* 参考译文 */}
                      <section className="tr-section">
                        <h4 className="tr-section-title">
                          <span className="tr-num">3</span>
                          参考译文
                        </h4>
                        <p className="tr-en">{item.en}</p>
                      </section>

                      {/* 必备词块 */}
                      <section className="tr-section">
                        <h4 className="tr-section-title">
                          <span className="tr-num">4</span>
                          必备词块
                        </h4>
                        <p className="p-hint">这些表达在同类话题中反复出现，建议整块记忆。</p>
                        <div className="kw-grid">
                          {item.keyWords.map((k) => (
                            <div className="kw-item" key={k.en}>
                              <span className="kw-en">{k.en}</span>
                              <span className="kw-cn">{k.cn}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* 难点拆解 */}
                      <section className="tr-section">
                        <h4 className="tr-section-title">
                          <span className="tr-num">5</span>
                          难点拆解
                          <span className="tr-count">{item.difficulties.length} 处</span>
                        </h4>
                        <div className="diff-list">
                          {item.difficulties.map((d, k) => (
                            <div className="diff-item" key={k}>
                              <div className="diff-point">
                                <Icon name="target" size={14} />
                                {d.point}
                              </div>
                              <div className="diff-row">
                                <span className="diff-label">难在哪</span>
                                <p>{d.why}</p>
                              </div>
                              <div className="diff-row is-solution">
                                <span className="diff-label">怎么处理</span>
                                <p>{d.solution}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* 降级表达 */}
                      <section className="tr-section tr-section-fallback">
                        <h4 className="tr-section-title">
                          <span className="tr-num">6</span>
                          降级表达
                          <span className="tr-count">写不出来时怎么办</span>
                        </h4>
                        <p className="p-hint">
                          翻译评分<b>先看信息是否完整、语法是否正确</b>，再看句式。宁可写得简单，也不要空着或硬写错句。
                        </p>
                        <div className="fb-list">
                          {item.downgrade.map((d, k) => (
                            <div className="fb-item" key={k}>
                              <div className="fb-pair">
                                <div className="fb-side fb-hard">
                                  <span className="fb-tag">理想写法</span>
                                  <p>{d.hard}</p>
                                </div>
                                <div className="fb-arrow" aria-hidden="true">
                                  <Icon name="arrowRight" size={16} />
                                </div>
                                <div className="fb-side fb-easy">
                                  <span className="fb-tag">保底写法</span>
                                  <p>{d.easy}</p>
                                </div>
                              </div>
                              <p className="fb-note">{d.note}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* 应试提醒 */}
                      <div className="tr-tip">
                        <Icon name="sparkle" size={15} />
                        <span>{item.tip}</span>
                      </div>

                      <div className="p-actions">
                        <button
                          className={`btn btn-sm ${isDone ? 'btn-green' : 'btn-primary'}`}
                          onClick={() => markDone(item.id)}
                        >
                          <Icon name="check" size={14} />
                          {isDone ? '已完成' : '标记完成'}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
