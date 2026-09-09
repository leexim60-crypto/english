import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from './components/Navbar.jsx'
import HelpModal from './components/HelpModal.jsx'
import AuthModal from './components/AuthModal.jsx'
import Flashcards from './components/Flashcards.jsx'
import Quiz from './components/Quiz.jsx'
import DailySentence from './components/DailySentence.jsx'
import WordBook from './components/WordBook.jsx'
import Phrases from './components/Phrases.jsx'
import { useWords } from './hooks/useWords.js'
import { api } from './api.js'
import { clearReview } from './utils/review.js'

/**
 * 用户登录态：token + 用户信息存 localStorage（30 天免登录，即"记住登录态"）。
 * 未登录 = 本地模式，所有数据走 localStorage（和以前完全一致）。
 * 已登录 = 数据变更后自动同步到云端（防抖 1.5s），刷新/换设备时拉回。
 */
const SYNC_KEYS = ['favorites', 'learnedWords', 'wordReviewMeta', 'learnedPhrases', 'studyLog']
const AUTH_KEY = 'auth'

function loadAuth() {
  try {
    const a = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
    return a && a.token && a.user ? a : null
  } catch {
    return null
  }
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [helpOpen, setHelpOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [auth, setAuth] = useState(loadAuth)
  const { words, sentences, counts, source, loading } = useWords()

  // ===== 各类学习数据：仍以 localStorage 为唯一数据源（简单可靠），
  // 登录状态下变更后异步镜像到云端 =====
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]')
    } catch {
      return []
    }
  })
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id) => {
    const removing = favorites.includes(id)
    setFavorites((prev) =>
      removing ? prev.filter((f) => f !== id) : [...prev, id]
    )
    // 从生词本移除时，同步清理复习调度数据
    if (removing) clearReview(id)
  }

  // ===== 登录：拉取云端数据并合并（并集策略，两边数据都不丢） =====
  const syncTimerRef = useRef(null)

  const mergeCloudData = useCallback(async (token) => {
    try {
      const { data } = await api.getUserData(token)
      for (const key of SYNC_KEYS) {
        if (!data[key]) continue
        // 并集合并：本地 + 云端去重
        let local = []
        let cloud = data[key]
        try {
          local = JSON.parse(localStorage.getItem(key) || 'null') || []
        } catch {
          local = []
        }
        if (Array.isArray(local) && Array.isArray(cloud)) {
          const merged = [...new Set([...local, ...cloud])]
          localStorage.setItem(key, JSON.stringify(merged))
          if (key === 'favorites') setFavorites(merged)
        } else if (!Array.isArray(local)) {
          // 本地没有（对象型数据如 wordReviewMeta/studyLog）：直接用云端
          localStorage.setItem(key, JSON.stringify(cloud))
        }
        // 对象型（reviewMeta）与数组型混合时，深合并留作后续优化
      }
      // 合并后强制刷新一次页面状态（最简单可靠的方式）
      window.location.reload()
    } catch {
      /* 拉取失败不影响使用，继续本地数据 */
    }
  }, [])

  const handleLoginSuccess = useCallback(
    (result) => {
      localStorage.setItem(AUTH_KEY, JSON.stringify(result))
      setAuth(result)
      mergeCloudData(result.token)
    },
    [mergeCloudData]
  )

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setAuth(null)
    // 云端保留数据，下次登录还会合并回来
  }, [])

  // ===== 数据变更后防抖同步到云端 =====
  useEffect(() => {
    if (!auth) return
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(async () => {
      for (const key of SYNC_KEYS) {
        let value = null
        try {
          value = JSON.parse(localStorage.getItem(key) || 'null')
        } catch {
          continue
        }
        if (value === null) continue
        try {
          await api.uploadUserData(auth.token, key, value)
        } catch {
          /* 单次失败跳过，下次变更再同步 */
        }
      }
    }, 1500)
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [favorites, auth]) // favorites 变化代表用户有操作；其他数据变更时也会随下次操作同步

  return (
    <div className="app">
      <Navbar
        tab={tab}
        setTab={setTab}
        favoritesCount={favorites.length}
        source={source}
        loading={loading}
        onHelp={() => setHelpOpen(true)}
        auth={auth}
        onLogin={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />
      <main className="main">
        {tab === 'home' && (
          <DailySentence
            onGo={() => setTab('cards')}
            onReview={() => setTab('wordbook')}
            onHelp={() => setHelpOpen(true)}
            sentences={sentences}
            counts={counts}
            favorites={favorites}
          />
        )}
        {tab === 'cards' && (
          <Flashcards
            words={words}
            counts={counts}
            source={source}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {tab === 'quiz' && (
          <Quiz words={words} source={source} favorites={favorites} toggleFavorite={toggleFavorite} />
        )}
        {tab === 'phrases' && <Phrases source={source} />}
        {tab === 'wordbook' && (
          <WordBook words={words} favorites={favorites} toggleFavorite={toggleFavorite} />
        )}
      </main>
      <footer className="footer">
        <p>🎓 英语学习网 · 每天进步一点点 · Keep Learning!</p>
      </footer>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>
  )
}
