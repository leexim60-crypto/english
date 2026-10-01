import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icons.jsx'
import useTheme from '../hooks/useTheme.js'
import useScrollProgress from '../hooks/useScrollProgress.js'

/**
 * 导航结构：3 个顶层入口 + 下拉分组
 * ---------------------------------------------------------------
 * 之前 7 个平铺项在中等屏幕上过于拥挤，改为「首页 / 背单词 / 写作提升」
 * 三个入口，子项收进下拉菜单，既减少视觉噪音也保持层级清晰。
 */
const NAV_GROUPS = [
  { key: 'home', label: '首页', icon: 'home', items: null },
  {
    key: 'vocab',
    label: '背单词',
    icon: 'cards',
    items: [
      { key: 'cards', label: '单词卡片', icon: 'cards', desc: '翻转卡片，标记认识与否' },
      { key: 'quiz', label: '单词测验', icon: 'quiz', desc: '每日 10 题，检验掌握度' },
      { key: 'wordbook', label: '生词本', icon: 'star', desc: '间隔重复，自动排复习' },
    ],
  },
  {
    key: 'skill',
    label: '写作提升',
    icon: 'sparkle',
    items: [
      { key: 'phrases', label: '短语学习', icon: 'chat', desc: '按主题积累地道表达' },
      { key: 'patterns', label: '高分句型', icon: 'sparkle', desc: '四六级考研作文句式' },
      { key: 'translation', label: '翻译练习', icon: 'book', desc: '真题 + 热点预测，含降级方案' },
    ],
  },
]

/** 扁平列表：移动端抽屉用（空间充足，直接全展开） */
const FLAT_ITEMS = NAV_GROUPS.flatMap((g) =>
  g.items ? g.items.map((i) => ({ ...i, group: g.label })) : [{ ...g, group: null }]
)

export default function Navbar({
  tab,
  setTab,
  favoritesCount,
  source,
  loading,
  onHelp,
  auth,
  onLogin,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const { isDark, toggle } = useTheme()
  const progress = useScrollProgress()
  const closeTimer = useRef(null)

  // 抽屉打开时锁滚动 + Esc 关闭
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // 点击外部关闭下拉
  useEffect(() => {
    if (!openGroup) return
    const onDown = (e) => {
      if (!e.target.closest('.nav-group')) setOpenGroup(null)
    }
    const onKey = (e) => e.key === 'Escape' && setOpenGroup(null)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openGroup])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const go = (key) => {
    setTab(key)
    setMenuOpen(false)
    setOpenGroup(null)
  }

  // 悬停展开（桌面）：延迟关闭，避免鼠标划过时闪动
  const hoverOpen = (key) => {
    clearTimeout(closeTimer.current)
    setOpenGroup(key)
  }
  const hoverClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenGroup(null), 140)
  }

  const online = source === 'server'
  const isGroupActive = (g) => g.items?.some((i) => i.key === tab)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <button className="brand-home" onClick={() => go('home')} aria-label="回到首页">
            <span className="logo" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="23" height="23" aria-hidden="true">
                <path
                  d="M4 7.4c3.9-1.7 7.9-1.7 11.2 0 3.3-1.7 7.3-1.7 11.2 0v17.2c-3.9-1.7-7.9-1.7-11.2 0-3.3-1.7-7.3-1.7-11.2 0z"
                  fill="rgba(255,255,255,.95)"
                />
                <path d="M15.2 7.4v17.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".45" />
              </svg>
            </span>
            <span className="brand-text">
              <span className="brand-name">英语学习网</span>
              <span className="brand-sub">English Learning</span>
            </span>
          </button>
          {!loading && (
            <span
              className={`status-dot ${online ? 'is-on' : ''}`}
              title={online ? '已连接后端（MySQL + Redis）' : '后端离线，使用本地词库'}
            >
              <span className="status-pulse" />
              {online ? '在线' : '离线'}
            </span>
          )}
        </div>

        {/* ===== 桌面端：3 个入口 + 下拉 ===== */}
        <nav className="navbar-menu" aria-label="主导航">
          {NAV_GROUPS.map((g) => {
            if (!g.items) {
              return (
                <button
                  key={g.key}
                  className={`nav-item ${tab === g.key ? 'active' : ''}`}
                  data-tab={g.key}
                  onClick={() => go(g.key)}
                >
                  <Icon name={g.icon} size={17} />
                  <span>{g.label}</span>
                </button>
              )
            }

            const active = isGroupActive(g)
            const open = openGroup === g.key

            return (
              <div
                key={g.key}
                className="nav-group"
                onMouseEnter={() => hoverOpen(g.key)}
                onMouseLeave={hoverClose}
              >
                <button
                  className={`nav-item nav-group-btn ${active ? 'active' : ''} ${open ? 'is-open' : ''}`}
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenGroup(open ? null : g.key)}
                >
                  <Icon name={g.icon} size={17} />
                  <span>{g.label}</span>
                  <Icon name="chevronDown" size={14} className="nav-caret" />
                </button>

                {open && (
                  <div className="nav-dropdown" role="menu">
                    {g.items.map((item) => (
                      <button
                        key={item.key}
                        role="menuitem"
                        className={`dropdown-item ${tab === item.key ? 'is-active' : ''}`}
                        data-tab={item.key}
                        onClick={() => go(item.key)}
                      >
                        <span className="dropdown-icon">
                          <Icon name={item.icon} size={17} />
                        </span>
                        <span className="dropdown-text">
                          <span className="dropdown-label">
                            {item.label}
                            {item.key === 'wordbook' && favoritesCount > 0 && (
                              <span className="nav-count">{favoritesCount}</span>
                            )}
                          </span>
                          <span className="dropdown-desc">{item.desc}</span>
                        </span>
                        {tab === item.key && (
                          <Icon name="check" size={15} className="dropdown-check" strokeWidth={2.4} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={onHelp} title="使用手册" aria-label="使用手册">
            <Icon name="help" size={19} />
          </button>
          <button
            className="icon-btn theme-toggle"
            onClick={toggle}
            title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
            aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={19} />
          </button>

          {auth ? (
            <div className="nav-user">
              <span className="avatar" aria-hidden="true">
                {auth.user.username.slice(0, 1).toUpperCase()}
              </span>
              <span className="nav-username" title={auth.user.username}>
                {auth.user.username}
              </span>
              <button
                className="icon-btn"
                onClick={onLogout}
                title="退出登录（云端数据保留）"
                aria-label="退出登录"
              >
                <Icon name="logout" size={18} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm nav-login" onClick={onLogin}>
              <Icon name="login" size={16} />
              登录
            </button>
          )}

          <button
            className={`navbar-burger ${menuOpen ? 'burger-open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="菜单"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* 阅读进度条 */}
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* ===== 移动端抽屉：用 portal 挂到 body，否则会被 navbar 的 backdrop-filter 裁切 ===== */}
      {menuOpen &&
        createPortal(
          <>
            <div className="navbar-drawer-mask" onClick={() => setMenuOpen(false)} />
            <aside className="navbar-drawer" role="dialog" aria-label="导航菜单">
              <div className="drawer-head">
                <span className="drawer-title">导航</span>
                <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="关闭菜单">
                  <Icon name="close" size={18} />
                </button>
              </div>

              {auth && (
                <div className="drawer-user">
                  <span className="avatar">{auth.user.username.slice(0, 1).toUpperCase()}</span>
                  <span>{auth.user.username}</span>
                </div>
              )}

              <div className="drawer-list">
                {FLAT_ITEMS.map((item, i) => (
                  <button
                    key={item.key}
                    className={`drawer-item ${tab === item.key ? 'drawer-item-active' : ''}`}
                    data-tab={item.key}
                    style={{ '--i': i }}
                    onClick={() => go(item.key)}
                  >
                    <Icon name={item.icon} size={19} />
                    <span className="drawer-item-text">
                      <span>{item.label}</span>
                      {item.group && <span className="drawer-item-group">{item.group}</span>}
                    </span>
                    {item.key === 'wordbook' && favoritesCount > 0 && (
                      <span className="nav-count">{favoritesCount}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="drawer-foot">
                <button className="drawer-item" onClick={() => { onHelp(); setMenuOpen(false) }}>
                  <Icon name="help" size={19} />
                  <span className="drawer-item-text"><span>使用手册</span></span>
                </button>
                <button className="drawer-item" onClick={toggle}>
                  <Icon name={isDark ? 'sun' : 'moon'} size={19} />
                  <span className="drawer-item-text">
                    <span>{isDark ? '亮色模式' : '暗色模式'}</span>
                  </span>
                </button>
                {auth ? (
                  <button
                    className="drawer-item drawer-danger"
                    onClick={() => { onLogout(); setMenuOpen(false) }}
                  >
                    <Icon name="logout" size={19} />
                    <span className="drawer-item-text"><span>退出登录</span></span>
                  </button>
                ) : (
                  <button
                    className="drawer-item drawer-danger"
                    onClick={() => { onLogin(); setMenuOpen(false) }}
                  >
                    <Icon name="login" size={19} />
                    <span className="drawer-item-text"><span>登录 / 注册</span></span>
                  </button>
                )}
              </div>
            </aside>
          </>,
          document.body
        )}
    </header>
  )
}
