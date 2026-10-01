import { useState, useMemo, useCallback } from 'react'
import { patterns, CATEGORIES, LEVELS, LEVEL_NAMES } from '../data/patterns.js'
import { lsGetJSON, lsSet } from '../utils/storage.js'
import { toast } from '../utils/toast.js'
import Icon from './Icons.jsx'
import Reveal from './Reveal.jsx'
import SpeakButton from './SpeakButton.jsx'

/**
 * 句型学习（四六级 / 考研 高分作文）
 * ---------------------------------------------------------------
 * 每个句型包含：骨架 / 中文释义 / 使用场景 / 例句 / 同义替换 / 易错点。
 * 支持按"写作功能"和"考试级别"双维度筛选，标记掌握后本地持久化。
 */
export default function SentencePatterns() {
  const [cat, setCat] = useState('all')
  const [level, setLevel] = useState('all')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(null)
  const [mastered, setMastered] = useState(() => lsGetJSON('masteredPatterns', []))

  const masteredSet = useMemo(() => new Set(mastered), [mastered])

  const toggleMastered = useCallback(
    (id, e) => {
      e?.stopPropagation()
      setMastered((prev) => {
        const has = prev.includes(id)
        const next = has ? prev.filter((i) => i !== id) : [...prev, id]
        lsSet('masteredPatterns', next)
        toast(has ? '已取消掌握标记' : '已标记为掌握 ✓', has ? 'info' : 'success', 1400)
        return next
      })
    },
    []
  )

  const list = useMemo(() => {
    const kw = search.trim().toLowerCase()
    return patterns.filter((p) => {
      if (cat !== 'all' && p.cat !== cat) return false
      if (level !== 'all' && !p.levels.includes(level)) return false
      if (!kw) return true
      return (
        p.structure.toLowerCase().includes(kw) ||
        p.cn.includes(kw) ||
        p.usage.includes(kw) ||
        p.examples.some((e) => e.en.toLowerCase().includes(kw) || e.cn.includes(kw))
      )
    })
  }, [cat, level, search])

  const progress = patterns.length
    ? Math.round((mastered.filter((id) => patterns.some((p) => p.id === id)).length / patterns.length) * 100)
    : 0

  return (
    <div className="patterns">
      <header className="page-head">
        <div className="page-head-main">
          <h2 className="page-title">
            <Icon name="sparkle" size={24} />
            高分句型
          </h2>
          <p className="page-desc">
            四六级 / 考研作文常用句式 —— 每个句型都说明<b>什么时候用</b>、<b>怎么替换</b>、<b>哪里容易错</b>。
          </p>
        </div>
        <div className="page-head-stat">
          <span className="stat-value num">{mastered.length}</span>
          <span className="stat-label">/ {patterns.length} 已掌握</span>
        </div>
      </header>

      <div className="mastery">
        <div className="mastery-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="mastery-text">
          掌握进度 <b className="num">{progress}%</b>
        </span>
      </div>

      {/* ===== 筛选区 ===== */}
      <div className="filters">
        <div className="search-wrap">
          <Icon name="search" size={17} className="search-icon" />
          <input
            className="wordbook-search"
            type="search"
            placeholder="搜索句型、释义或场景…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="搜索句型"
          />
        </div>

        <div className="level-tabs">
          {LEVELS.map((l) => (
            <button
              key={l.key}
              className={`chip ${level === l.key ? 'chip-active' : ''}`}
              onClick={() => setLevel(l.key)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cat-scroll" role="tablist" aria-label="写作功能分类">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            role="tab"
            aria-selected={cat === c.key}
            className={`cat-chip ${cat === c.key ? 'is-active' : ''}`}
            onClick={() => setCat(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ===== 句型列表 ===== */}
      {list.length === 0 ? (
        <p className="empty">没有匹配的句型，换个关键词试试</p>
      ) : (
        <div className="pattern-list">
          {list.map((p, i) => {
            const open = openId === p.id
            const done = masteredSet.has(p.id)
            return (
              <Reveal key={p.id} delay={Math.min(i, 8) * 40} className="pattern-row">
                <article className={`pattern-card ${open ? 'is-open' : ''} ${done ? 'is-done' : ''}`}>
                  <button
                    className="pattern-head"
                    onClick={() => setOpenId(open ? null : p.id)}
                    aria-expanded={open}
                  >
                    <span className="pattern-head-main">
                      <span className="pattern-structure">{p.structure}</span>
                      <span className="pattern-cn">{p.cn}</span>
                    </span>

                    <span className="pattern-meta">
                      {p.levels.map((lv) => (
                        <span key={lv} className={`lv-tag lv-${lv}`}>
                          {LEVEL_NAMES[lv]}
                        </span>
                      ))}
                      <span className="pattern-toggle" aria-hidden="true">
                        <Icon name="arrowRight" size={16} />
                      </span>
                    </span>
                  </button>

                  {open && (
                    <div className="pattern-body">
                      {/* 使用场景 */}
                      <section className="p-block">
                        <h4 className="p-block-title">
                          <Icon name="target" size={15} />
                          什么时候用
                        </h4>
                        <p className="p-text">{p.usage}</p>
                        <ul className="p-when">
                          {p.when.map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      </section>

                      {/* 例句 */}
                      <section className="p-block">
                        <h4 className="p-block-title">
                          <Icon name="chat" size={15} />
                          例句
                        </h4>
                        <div className="p-examples">
                          {p.examples.map((ex, k) => (
                            <div className="p-example" key={k}>
                              <div className="p-example-en">
                                <span>{ex.en}</span>
                                <SpeakButton text={ex.en} variant="sm" />
                              </div>
                              <p className="p-example-cn">{ex.cn}</p>
                              {ex.note && <p className="p-example-note">{ex.note}</p>}
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* 同义替换 */}
                      <section className="p-block">
                        <h4 className="p-block-title">
                          <Icon name="refresh" size={15} />
                          同义替换
                        </h4>
                        <p className="p-hint">同一个功能换着用，避免全文重复同一句式。</p>
                        <div className="p-variants">
                          {p.variants.map((v) => (
                            <span className="variant-tag" key={v}>
                              {v}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* 易错点 */}
                      <section className="p-block p-block-warn">
                        <h4 className="p-block-title">
                          <Icon name="close" size={15} />
                          易错点
                        </h4>
                        <p className="p-text">{p.pitfall}</p>
                      </section>

                      <div className="p-actions">
                        <button
                          className={`btn btn-sm ${done ? 'btn-green' : 'btn-primary'}`}
                          onClick={(e) => toggleMastered(p.id, e)}
                        >
                          <Icon name="check" size={14} />
                          {done ? '已掌握' : '标记掌握'}
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
