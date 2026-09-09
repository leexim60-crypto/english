import { useState, useEffect } from 'react'

export default function Navbar({ tab, setTab, favoritesCount, source, loading, onHelp }) {
  const items = [
    { key: 'home', label: '🏠 首页' },
    { key: 'cards', label: '📚 单词卡片' },
    { key: 'quiz', label: '📝 单词测验' },
    { key: 'phrases', label: '💬 短语学习' },
    { key: 'wordbook', label: `⭐ 生词本${favoritesCount ? ` (${favoritesCount})` : ''}` },
  ]

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

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setTab('home')}>
        <span className="logo">ABC</span>
        <span>英语学习网</span>
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
        <button
          className="nav-item"
          onClick={onHelp}
          title="查看使用手册"
        >
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
    </nav>
  )
}
