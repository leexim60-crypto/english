import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icons.jsx'
import useTheme from '../hooks/useTheme.js'
import useScrollProgress from '../hooks/useScrollProgress.js'

const NAV_ITEMS = [
  { key: 'home', label: '首页', icon: 'home' },
  { key: 'cards', label: '单词卡片', icon: 'cards' },
  { key: 'quiz', label: '单词测验', icon: 'quiz' },
  { key: 'phrases', label: '短语学习', icon: 'chat' },
  { key: 'wordbook', label: '生词本', icon: 'star' },
]

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
  const { isDark, toggle } = useTheme()
  const progress = useScrollProgress()
  const drawerRef = useRef(null)

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

  const go = (key) => {
    setTab(key)
    setMenuOpen(false)
  }

  const online = source === 'server'

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <button className="brand-home" onClick={() => go('home')} aria-label="回到首页">
            <span className="logo" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
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

        {/* 桌面端菜单 */}
        <nav className="navbar-menu" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${tab === item.key ? 'active' : ''}`}
              data-tab={item.key}
              onClick={() => setTab(item.key)}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
              {item.key === 'wordbook' && favoritesCount > 0 && (
                <span className="nav-count">{favoritesCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={onHelp} title="使用手册" aria-label="使用手册">
            <Icon name="help" size={18} />
          </button>
          <button
            className="icon-btn theme-toggle"
            onClick={toggle}
            title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
            aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={18} />
          </button>

          {auth ? (
            <div className="nav-user">
              <span className="avatar" aria-hidden="true">
                {auth.user.username.slice(0, 1).toUpperCase()}
              </span>
              <span className="nav-username" title={auth.user.username}>
                {auth.user.username}
              </span>
              <button className="icon-btn" onClick={onLogout} title="退出登录（云端数据保留）" aria-label="退出登录">
                <Icon name="logout" size={17} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm nav-login" onClick={onLogin}>
              <Icon name="login" size={15} />
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

      {/* 移动端抽屉：用 portal 挂到 body，否则会被 navbar 的 backdrop-filter 裁切 */}
      {menuOpen &&
        createPortal(
          <>
            <div className="navbar-drawer-mask" onClick={() => setMenuOpen(false)} />
            <aside className="navbar-drawer" ref={drawerRef} role="dialog" aria-label="导航菜单">
              <div className="drawer-head">
                <span className="drawer-title">导航</span>
                <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="关闭菜单">
                  <Icon name="close" size={17} />
                </button>
              </div>

              {auth && (
                <div className="drawer-user">
                  <span className="avatar">{auth.user.username.slice(0, 1).toUpperCase()}</span>
                  <span>{auth.user.username}</span>
                </div>
              )}

              <div className="drawer-list">
                {NAV_ITEMS.map((item, i) => (
                  <button
                    key={item.key}
                    className={`drawer-item ${tab === item.key ? 'drawer-item-active' : ''}`}
                    data-tab={item.key}
                    style={{ '--i': i }}
                    onClick={() => go(item.key)}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    {item.key === 'wordbook' && favoritesCount > 0 && (
                      <span className="nav-count">{favoritesCount}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="drawer-foot">
                <button className="drawer-item" onClick={() => { onHelp(); setMenuOpen(false) }}>
                  <Icon name="help" size={18} />
                  <span>使用手册</span>
                </button>
                <button className="drawer-item" onClick={toggle}>
                  <Icon name={isDark ? 'sun' : 'moon'} size={18} />
                  <span>{isDark ? '亮色模式' : '暗色模式'}</span>
                </button>
                {auth ? (
                  <button className="drawer-item drawer-danger" onClick={() => { onLogout(); setMenuOpen(false) }}>
                    <Icon name="logout" size={18} />
                    <span>退出登录</span>
                  </button>
                ) : (
                  <button className="drawer-item drawer-danger" onClick={() => { onLogin(); setMenuOpen(false) }}>
                    <Icon name="login" size={18} />
                    <span>登录 / 注册</span>
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
