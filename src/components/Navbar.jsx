import { useState, useEffect } from 'react'

export default function Navbar({ tab, setTab, favoritesCount, source, loading, onHelp }) {
  const items = [
    { key: 'home', label: '🏠 首页' },
    { key: 'cards', label: '📚 单词卡片' },
    { key: 'quiz', label: '📝 单词测验' },
    { key: 'phrases', label: '💬 短语学习' },
    { key: 'wordbook', label: `⭐ 生词本${favoritesCount ? ` (${favoritesCount})` : ''}` },
  ]

  // ===== 移动端汉堡菜单 =====
  const [menuOpen, setMenuOpen] = useState(false)

  // ===== 暗色模式（localStorage 持久化） =====
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark'
    } catch {
      return false
    }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : ''
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }, [dark])

  // 切换 tab 后自动收起菜单
  const go = (key) => {
    setTab(key)
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => go('home')}>
        <span className="logo">ABC</span>
        <span className="brand-name">英语学习网</span>
        {!loading && (
          <span
            className={`api-badge ${source === 'server' ? 'api-badge-on' : 'api-badge-off'}`}
            title={
              source === 'server'
                ? '已连接后端（MySQL + Redis）'
                : '后端未启动，正在使用本地词库'
            }
          >
            {source === 'server' ? '● 在线' : '○ 离线'}
          </span>
        )}
      </div>

      {/* 桌面端：完整菜单 */}
      <div className="navbar-menu">
        {items.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${tab === item.key ? 'active' : ''}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
        <button className="nav-item" onClick={onHelp} title="查看使用手册">
          ❓ 使用手册
        </button>
        <button
          className="nav-item theme-toggle"
          onClick={() => setDark((d) => !d)}
          title={dark ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {dark ? '☀️ 亮色' : '🌙 暗色'}
        </button>
      </div>

      {/* 移动端：汉堡按钮 */}
      <button
        className={`navbar-burger ${menuOpen ? 'burger-open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="菜单"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>

      {/* 移动端：抽屉菜单 */}
      {menuOpen && (
        <>
          <div className="navbar-drawer-mask" onClick={() => setMenuOpen(false)} />
          <div className="navbar-drawer">
            {items.map((item) => (
              <button
                key={item.key}
                className={`drawer-item ${tab === item.key ? 'drawer-item-active' : ''}`}
                onClick={() => go(item.key)}
              >
                {item.label}
              </button>
            ))}
            <button className="drawer-item" onClick={() => { onHelp(); setMenuOpen(false) }}>
              ❓ 使用手册
            </button>
            <button className="drawer-item" onClick={() => setDark((d) => !d)}>
              {dark ? '☀️ 亮色模式' : '🌙 暗色模式'}
            </button>
          </div>
        </>
      )}
    </nav>
  )
}
