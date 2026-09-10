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
 * 数据同步架构：
 *
 *  - localStorage 始终是唯一数据源（未登录也完全可用）
 *  - 已登录时：应用启动 / 登录成功 → 先拉云端数据与本地深度合并（只增不丢）
 *    → 合并完成后才开启上传（syncReady），防止旧的本地数据覆盖云端
 *  - 上传时机：favorites 变化（1.5s 防抖）+ 每 30s 定时 + 页面切到后台时
 *    （learnedWords/studyLog 等由各组件直接写 localStorage，不走 React 状态，需轮询）
 *
 * 合并策略（并集/取优，两台设备的数据都不会丢）：
 *  - 数组（favorites/learnedWords/learnedPhrases）→ 去重并集
 *  - wordReviewMeta {id:{interval,reps,next}} → 逐字段取较大值（进度更优者胜）
 *  - studyLog {日期:true} → 键并集
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

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

/** 深度合并：数组取并集，对象递归合并，数字取大，其余取云端 */
function deepMerge(local, cloud) {
  if (Array.isArray(local) && Array.isArray(cloud)) {
    return [...new Set([...local, ...cloud])]
  }
  if (isPlainObject(local) && isPlainObject(cloud)) {
    const out = { ...local }
    for (const k of Object.keys(cloud)) {
      const l = local[k]
      const c = cloud[k]
      if (isPlainObject(l) && isPlainObject(c)) out[k] = deepMerge(l, c)
      else if (typeof l === 'number' && typeof c === 'number') out[k] = Math.max(l, c)
      else if (l === undefined) out[k] = c
      else if (c === undefined) out[k] = l
      else out[k] = c
    }
    return out
  }
  return cloud === undefined ? local : cloud
}

/** 拉取云端数据并与本地合并，返回是否有变化 */
async function pullAndMerge(token) {
  const { data } = await api.getUserData(token)
  let changed = false
  for (const key of SYNC_KEYS) {
    const cloud = data[key]
    if (cloud === undefined) continue
    let local = null
    try {
      local = JSON.parse(localStorage.getItem(key) || 'null')
    } catch {
      local = null
    }
    if (local === null) {
      localStorage.setItem(key, JSON.stringify(cloud))
      changed = true
      continue
    }
    const merged = deepMerge(local, cloud)
    if (JSON.stringify(merged) !== JSON.stringify(local)) {
      localStorage.setItem(key, JSON.stringify(merged))
      changed = true
    }
  }
  return changed
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [helpOpen, setHelpOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [auth, setAuth] = useState(loadAuth)
  // syncReady：完成首次云端拉取合并后才允许上传（防止竞态覆盖云端数据）
  const [syncReady, setSyncReady] = useState(!auth)
  const pullLockRef = useRef(false)
  const lastUploadedRef = useRef({})
  const { words, sentences, counts, source, loading } = useWords()

  // ===== 学习数据：localStorage 为唯一数据源 =====
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

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setAuth(null)
    setSyncReady(true) // 未登录状态无需门控
    lastUploadedRef.current = {}
    // 云端数据保留，下次登录还会合并回来
  }, [])

  // ===== 首次拉取：登录成功 / 已登录的会话启动时，先合并云端再开上传 =====
  useEffect(() => {
    if (!auth || pullLockRef.current) return
    pullLockRef.current = true
    ;(async () => {
      let ok = false
      // 冷启动的免费后端可能较慢，重试 3 次
      for (let i = 0; i < 3 && !ok; i++) {
        try {
          const changed = await pullAndMerge(auth.token)
          ok = true
          if (changed) window.location.reload() // 有新数据 → 刷新让各组件重新读 localStorage
        } catch (err) {
          if (/HTTP 401/.test(err.message || '')) {
            handleLogout() // token 过期
            return
          }
          await new Promise((r) => setTimeout(r, 2000))
        }
      }
      // 拉取始终失败（断网等）：照常允许上传，不能因为同步问题卡住学习
      setSyncReady(true)
      pullLockRef.current = false
    })()
  }, [auth, handleLogout])

  const handleLoginSuccess = useCallback((result) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(result))
    lastUploadedRef.current = {}
    setSyncReady(false)
    setAuth(result) // 触发上面的拉取合并 effect
  }, [])

  // ===== 上传：把所有 SYNC_KEYS 镜像到云端（未变化的 key 跳过） =====
  const uploadAll = useCallback(async () => {
    if (!auth) return
    for (const key of SYNC_KEYS) {
      let raw = null
      try {
        raw = localStorage.getItem(key)
      } catch {
        continue
      }
      if (raw === null || lastUploadedRef.current[key] === raw) continue
      let value
      try {
        value = JSON.parse(raw)
      } catch {
        continue
      }
      try {
        await api.uploadUserData(auth.token, key, value)
        lastUploadedRef.current[key] = raw
      } catch {
        /* 本次失败，下轮再试 */
      }
    }
  }, [auth])

  // 触发点 1：favorites 变化（防抖 1.5s）
  useEffect(() => {
    if (!auth || !syncReady) return
    const t = setTimeout(uploadAll, 1500)
    return () => clearTimeout(t)
  }, [favorites, auth, syncReady, uploadAll])

  // 触发点 2：每 30s 双向同步（上传本地变更 + 拉取云端新数据）
  // 覆盖 learnedWords/studyLog 等直写 localStorage 的数据，也解决
  // “另一台设备上传了新数据而本页一直开着看不到”的问题
  useEffect(() => {
    if (!auth || !syncReady) return
    const sync = async () => {
      try {
        const changed = await pullAndMerge(auth.token)
        if (changed) {
          // 拉到了新数据：更新 React 状态（favorites），
          // 其他列表组件在切换标签时重新读 localStorage；
          // 并重置上传指纹，把合并结果回传云端（保证两台设备最终一致）
          try {
            setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'))
          } catch {
            /* ignore */
          }
          lastUploadedRef.current = {}
        }
      } catch {
        /* 拉取失败不影响上传 */
      }
      uploadAll()
    }
    const iv = setInterval(sync, 30000)
    const onHide = () => {
      if (document.visibilityState === 'hidden') uploadAll()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      clearInterval(iv)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [auth, syncReady, uploadAll])

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
