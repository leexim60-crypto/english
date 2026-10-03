import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  patterns,
  CATEGORIES,
  LEVELS,
  LEVEL_NAMES,
  TIERS,
  TIER_NAMES,
  FORMS,
  FORM_ORDER,
  PATTERN_STATS,
} from '../data/patterns.js'
import { lsGetJSON, lsSet } from '../utils/storage.js'
import { toast } from '../utils/toast.js'
import Icon from './Icons.jsx'
import Reveal from './Reveal.jsx'
import SpeakButton from './SpeakButton.jsx'

/**
 * 高分句型（四六级 / 考研作文）
 * ---------------------------------------------------------------
 * 每个句型包含：骨架 / 释义 / 使用场景 / 例句 / 同义替换 / 易错点，
 * 外加「平庸写法 → 高分写法」对照，直接看出差距在哪。
 *
 * 三个筛选维度互相独立，可以叠加：
 *   难度档次  core 稳妥提分 → advanced 高级 → expert 很高级
 *   句式类型  倒装 / 虚拟 / 强调 / 分词 / 独立主格 …
 *   写作功能  开篇 / 论证 / 让步 / 结尾 …
 */
export default function SentencePatterns() {
  const [cat, setCat] = useState('all')
  const [level, setLevel] = useState('all')
  const [tier, setTier] = useState('all')
  const [form, setForm] = useState('all')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(null)
  const [mastered, setMastered] = useState(() => lsGetJSON('masteredPatterns', []))

  const masteredSet = useMemo(() => new Set(mastered), [mastered])

  const toggleMastered = useCallback((id, e) => {
    e?.stopPropagation()
    setMastered((prev) => {
      const has = prev.includes(id)
      const next = has ? prev.filter((i) => i !== id) : [...prev, id]
      lsSet('masteredPatterns', next)
      toast(has ? '已取消掌握标记' : '已标记为掌握 ✓', has ? 'info' : 'success', 1400)
      return next
    })
  }, [])

  const list = useMemo(() => {
    const kw = search.trim().toLowerCase()
    return patterns.filter((p) => {
      if (cat !== 'all' && p.cat !== cat) return false
      if (level !== 'all' && !p.levels.includes(level)) return false
      if (tier !== 'all' && p.tier !== tier) return false
      if (form !== 'all' && p.form !== form) return false
      if (!kw) return true
      return (
        p.structure.toLowerCase().includes(kw) ||
        p.cn.includes(kw) ||
        p.usage.includes(kw) ||
        (p.pitfall || '').toLowerCase().includes(kw) ||
        p.variants.some((v) => v.toLowerCase().includes(kw)) ||
        p.examples.some((e) => e.en.toLowerCase().includes(kw) || e.cn.includes(kw))
      )
    })
  }, [cat, level, tier, form, search])

  // 筛选条件变化后，已展开的卡片可能已不在列表里 —— 收起，避免"看不见的展开态"
  const visibleIds = useMemo(() => new Set(list.map((p) => p.id)), [list])
  useEffect(() => {
    setOpenId((cur) => (cur !== null && !visibleIds.has(cur) ? null : cur))
  }, [visibleIds])

  const progress = PATTERN_STATS.total
    ? Math.round(
        (mastered.filter((id) => patterns.some((p) => p.id === id)).length / PATTERN_STATS.total) * 100
      )
    : 0

  const activeFilters = [
    cat !== 'all' && CATEGORIES.find((c) => c.key === cat)?.label,
    level !== 'all' && LEVELS.find((l) => l.key === level)?.label,
    tier !== 'all' && TIER_NAMES[tier],
    form !== 'all' && FORMS[form],
    search.trim() && `“${search.trim()}”`,
  ].filter(Boolean)

  const resetFilters = () => {
    setCat('all')
    setLevel('all')
    setTier('all')
    setForm('all')
    setSearch('')
  }

  // 折叠状态下用 ↑↓ / Enter 直接跳转，键盘用户不必逐个 Tab
  const [cursor, setCursor] = useState(-1)
  const listRef = useRef(null)

  const onKeyDown = (e) => {
    if (!list.length) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(Math.max(cursor + (e.key === 'ArrowDown' ? 1 : -1), 0), list.length - 1)
      setCursor(next)
      listRef.current?.querySelectorAll('.pattern-head')?.[next]?.focus()
    }
  }

  return (
    <div className="patterns">
      <header className="page-head">
        <div className="page-head-main">
          <h2 className="page-title">
            <Icon name="sparkle" size={23} />
            高分句型
          </h2>
          <p className="page-desc">
            {PATTERN_STATS.total} 个四六级／考研作文句式，按<b>难度档次</b>与<b>句式类型</b>分开整理。
            每个句型都写明<b>什么时候用</b>、<b>怎么替换</b>、<b>哪里容易错</b>，
            并附「平庸写法 → 高分写法」对照。
          </p>
        </div>
        <div className="page-head-stat">
          <span className="stat-value num">{mastered.length}</span>
          <span className="stat-label">/ {PATTERN_STATS.total} 已掌握</span>
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

      {/* ===== 难度档次：三档一步到位，带数量提示 ===== */}
      <div className="tier-row" role="group" aria-label="难度档次筛选">
        {TIERS.map((t) => {
          const count = t.key === 'all' ? PATTERN_STATS.total : PATTERN_STATS[t.key]
          const active = tier === t.key
          return (
            <button
              key={t.key}
              className={`tier-card ${active ? 'is-active' : ''} tier-card-${t.key}`}
              onClick={() => setTier(t.key)}
              aria-pressed={active}
              title={t.desc || '不限难度'}
            >
              <span className="tier-card-top">
                <span className="tier-card-label">{t.label}</span>
                <span className="tier-card-num num">{count}</span>
              </span>
              <span className="tier-card-desc">{t.desc || '全部档次混合浏览'}</span>
            </button>
          )
        })}
      </div>

      {/* ===== 搜索 + 级别 + 句式类型 ===== */}
      <div className="filters">
        <div className="search-wrap">
          <Icon name="search" size={16} className="search-icon" />
          <input
            className="wordbook-search"
            type="search"
            placeholder="搜索句型、释义、场景或易错点…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="搜索句型"
          />
        </div>

        <label className="select-wrap">
          <span className="select-label">句式</span>
          <select
            className="select"
            value={form}
            onChange={(e) => setForm(e.target.value)}
            aria-label="按句式类型筛选"
          >
            <option value="all">全部句式</option>
            {FORM_ORDER.map((f) => (
              <option key={f} value={f}>
                {FORMS[f]}（{patterns.filter((p) => p.form === f).length}）
              </option>
            ))}
          </select>
        </label>

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
            {c.key !== 'all' && (
              <span className="cat-num num">{PATTERN_STATS.byCat[c.key] || 0}</span>
            )}
          </button>
        ))}
      </div>

      {/* ===== 当前筛选回显 ===== */}
      <div className="filter-status">
        <span className="filter-count">
          共 <b className="num">{list.length}</b> 个句型
        </span>
        {activeFilters.length > 0 && (
          <>
            <span className="filter-sep" />
            <span className="filter-tags">
              {activeFilters.map((f) => (
                <span className="filter-tag" key={f}>
                  {f}
                </span>
              ))}
            </span>
            <button className="filter-clear" onClick={resetFilters}>
              <Icon name="close" size={13} />
              清除
            </button>
          </>
        )}
      </div>

      {/* ===== 句型列表 ===== */}
      {list.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="search" size={20} />
          </span>
          <p className="empty-title">没有匹配的句型</p>
          <p className="empty-desc">试试减少筛选条件，或换个关键词</p>
          <button className="btn btn-sm" onClick={resetFilters}>
            重置全部筛选
          </button>
        </div>
      ) : (
        <div className="pattern-list" ref={listRef} onKeyDown={onKeyDown}>
          {list.map((p, i) => {
            const open = openId === p.id
            const done = masteredSet.has(p.id)
            return (
              <Reveal key={p.id} delay={Math.min(i, 8) * 35} className="pattern-row">
                <article
                  className={`pattern-card ${open ? 'is-open' : ''} ${done ? 'is-done' : ''}`}
                  id={`pattern-${p.id}`}
                >
                  <button
                    className="pattern-head"
                    onClick={() => setOpenId(open ? null : p.id)}
                    aria-expanded={open}
                    aria-controls={`pattern-body-${p.id}`}
                  >
                    <span className="pattern-head-main">
                      <span className="pattern-structure">{p.structure}</span>
                      <span className="pattern-cn">{p.cn}</span>
                    </span>

                    <span className="pattern-meta">
                      <span className={`tier-tag tier-${p.tier}`}>{TIER_NAMES[p.tier]}</span>
                      <span className="form-tag">{FORMS[p.form]}</span>
                      <span className="pattern-toggle" aria-hidden="true">
                        <Icon name="arrowRight" size={15} />
                      </span>
                    </span>
                  </button>

                  {open && (
                    <div className="pattern-body" id={`pattern-body-${p.id}`}>
                      {/* 适用考试：放进展开区，避免折叠态每行堆 5 个徽章 */}
                      <div className="p-applicable">
                        <span className="p-applicable-label">适用</span>
                        {p.levels.map((lv) => (
                          <span key={lv} className={`lv-tag lv-${lv}`}>
                            {LEVEL_NAMES[lv]}
                          </span>
                        ))}
                        <span className="p-applicable-sep" />
                        <span className="p-applicable-label">句式</span>
                        <span className="form-tag">{FORMS[p.form]}</span>
                      </div>
                      {/* 使用场景 */}
                      <section className="p-block">
                        <h4 className="p-block-title">
                          <Icon name="target" size={13} />
                          什么时候用
                        </h4>
                        <p className="p-text">{p.usage}</p>
                        <ul className="p-when">
                          {p.when.map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      </section>

                      {/* 平庸 → 高分 */}
                      {p.upgrade && (
                        <section className="p-block">
                          <h4 className="p-block-title">
                            <Icon name="trend" size={13} />
                            平庸写法 → 高分写法
                          </h4>
                          <div className="p-upgrade">
                            <div className="p-upgrade-row">
                              <span className="p-upgrade-tag">平庸</span>
                              <p>{p.upgrade.from}</p>
                            </div>
                            <div className="p-upgrade-row is-good">
                              <span className="p-upgrade-tag">高分</span>
                              <p>{p.upgrade.to}</p>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* 例句 */}
                      <section className="p-block">
                        <h4 className="p-block-title">
                          <Icon name="chat" size={13} />
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
                          <Icon name="refresh" size={13} />
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
                          <Icon name="close" size={13} />
                          易错点
                        </h4>
                        <p className="p-text">{p.pitfall}</p>
                      </section>

                      <div className="p-actions">
                        <button
                          className={`btn btn-sm ${done ? 'btn-green' : 'btn-primary'}`}
                          onClick={(e) => toggleMastered(p.id, e)}
                        >
                          <Icon name="check" size={13} />
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
