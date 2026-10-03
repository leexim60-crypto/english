import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from './components/Navbar.jsx'
import HelpModal from './components/HelpModal.jsx'
import AuthModal from './components/AuthModal.jsx'
import Toast from './components/Toast.jsx'
import PageTransition from './components/PageTransition.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Icon from './components/Icons.jsx'
import Flashcards from './components/Flashcards.jsx'
import Quiz from './components/Quiz.jsx'
import DailySentence from './components/DailySentence.jsx'
import WordBook from './components/WordBook.jsx'
import Phrases from './components/Phrases.jsx'
import SentencePatterns from './components/SentencePatterns.jsx'
import Translation from './components/Translation.jsx'
import useScrollToTop from './hooks/useScrollToTop.js'
import { useWords } from './hooks/useWords.js'
import { api } from './api.js'
import { clearReview } from './utils/review.js'
import {
  lsGetArray,
  lsGetJSON,
  lsSet,
  sanitize,
  importAnonymousData,
  SYNC_KEYS,
} from './utils/storage.js'
import { toast } from './utils/toast.js'

/**
 * 数据同步架构（v3：按账号隔离）：
 *
 *  - 所有学习数据经 utils/storage.js 按账号隔离存储：
 *      已登录 → "u<userId>:favorites" 等（每个账号独立空间）
 *      未登录 → 匿名空间（无前缀）
 *  - 登录：匿名空间数据导入账号空间（仅首次）→ 拉云端深度合并（只增不丢）
 *          → 完成后才开启上传（syncReady 门控，防止旧数据覆盖云端）
 *  - 退出：回到匿名空间，看不到任何账号数据（账号数据留在本地+云端）
 *  - 已登录会话：每 30s 双向同步（上传本地变更 + 拉取云端新数据并合并）
 *
 * 合并策略：数组并集 / 复习进度逐字段取优 / 打卡日期并集 —— 两台设备数据都不丢。
 */
const AUTH_KEY = 'auth'

const TAB_TITLES = {
  home: '首页',
  cards: '单词卡片',
  quiz: '单词测验',
  phrases: '短语学习',
  patterns: '高分句型',
  translation: '翻译练习',
  wordbook: '生词本',
}

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

/** 两个值在结构上是否等价（用于判断合并结果有没有变化） */
function sameJSON(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

/**
 * 深度合并：数组取并集，对象递归合并，数字取大，其余取云端。
 *
 * 重要：显式跳过 undefined / null / NaN。
 * 之前云端的 null 值会被当成有效数据写回本地（JSON.stringify(null) = "null"），
 * 下次读取时 JSON.parse("null") === null，又被判定为“本地为空”而重写，
 * 于是每次 pullAndMerge 都返回 changed=true → 触发 window.location.reload() →
 * 页面加载后又同步 → 又 reload，形成无限刷新。
 */
function deepMerge(local, cloud) {
  if (Array.isArray(local) && Array.isArray(cloud)) {
    return [...new Set([...local, ...cloud])]
  }
  if (isPlainObject(local) && isPlainObject(cloud)) {
    const out = { ...local }
    for (const k of Object.keys(cloud)) {
      const l = local[k]
      const c = cloud[k]
      // 云端该字段无效：保留本地
      if (c === undefined || c === null) continue
      if (isPlainObject(l) && isPlainObject(c)) out[k] = deepMerge(l, c)
      else if (typeof l === 'number' && typeof c === 'number') out[k] = Math.max(l, c)
      else if (l === undefined) out[k] = c
      else if (c === undefined) out[k] = l
      else out[k] = c
    }
    return out
  }
  // 顶层：云端为空则保留本地
  if (cloud === undefined || cloud === null) return local
  return cloud
}

/** 拉取云端数据并与当前账号空间合并，返回是否有变化 */
async function pullAndMerge(token) {
  const { data } = await api.getUserData(token)
  let changed = false
  for (const key of SYNC_KEYS) {
    const raw = data[key]
    // 云端无此 key，或值是 null/undefined：视为“无数据”，不动本地
    if (raw === undefined || raw === null) continue
    // 按 key 校验云端形状。历史上出现过「对象与数组深度合并」把
    // 本应是数组的 key 变成对象，写回本地后直接让页面崩溃的情况，
    // 所以形状不符的云端值一律丢弃，不落地。
    const cloud = sanitize(key, raw)
    if (cloud === null) continue
    const local = lsGetJSON(key, null)
    if (local === null) {
      lsSet(key, cloud)
      changed = true
      continue
    }
    const merged = deepMerge(local, cloud)
    if (!sameJSON(merged, local)) {
      lsSet(key, merged)
      changed = true
    }
  }
  return changed
}

export default function App() {
  const [tab, setTab] = useState('home')
  const scrollTopVisible = useScrollToTop()
  const [helpOpen, setHelpOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [auth, setAuth] = useState(loadAuth)
  // syncReady：完成首次云端拉取合并后才允许上传（防止竞态覆盖云端数据）
  const [syncReady, setSyncReady] = useState(!auth)
  // dataVersion：云端拉取到新数据时自增，用于让子组件重读本地数据
  // （替代 window.location.reload()，避免刷新循环）
  const [dataVersion, setDataVersion] = useState(0)
  const pullLockRef = useRef(false)
  const lastUploadedRef = useRef({})
  const { words, sentences, counts, source, loading } = useWords()

  const [favorites, setFavorites] = useState(() => lsGetArray('favorites'))

  const toggleFavorite = (id) => {
    const removing = favorites.includes(id)
    const next = removing ? favorites.filter((f) => f !== id) : [...favorites, id]
    setFavorites(next)
    lsSet('favorites', next)
    // 从生词本移除时，同步清理复习调度数据
    if (removing) {
      clearReview(id)
      toast('已从生词本移除', 'info', 1500)
    } else {
      toast('已加入生词本 ⭐', 'success', 1500)
    }
  }

  const handleLogout = useCallback(() => {
    // 先清登录态（storage 层随之切回匿名空间），再从匿名空间读数据刷新界面
    localStorage.removeItem(AUTH_KEY)
    setAuth(null)
    setSyncReady(true)
    lastUploadedRef.current = {}
    setFavorites(lsGetArray('favorites'))
    toast('已退出登录，账号数据已保留 ☁️', 'info')
    // 账号数据留在本地隔离空间 + 云端，下次登录自动恢复
  }, [])

  // ===== 页面标题同步 + 切页时回到顶部 =====
  useEffect(() => {
    document.title = `英语学习网 · ${TAB_TITLES[tab] || '首页'}`
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [tab])

  // ===== 首次拉取：登录成功 / 已登录会话启动时，先合并云端再开上传 =====
  useEffect(() => {
    if (!auth || pullLockRef.current) return
    pullLockRef.current = true
    ;(async () => {
      // 首次登录此账号：把匿名空间数据导入账号空间作为初始数据
      importAnonymousData(auth.user.id)

      let pulled = false
      // 冷启动的免费后端可能较慢，重试 3 次
      for (let i = 0; i < 3 && !pulled; i++) {
        try {
          const changed = await pullAndMerge(auth.token)
          pulled = true
          // 用状态变更让页面重读本地数据，而不是 window.location.reload()。
          // 刷新页面会重新走一遍同步流程，一旦合并逻辑不收敛就会变成无限刷新。
          if (changed) setDataVersion((v) => v + 1)
        } catch (err) {
          if (/HTTP 401/.test(err.message || '')) {
            handleLogout() // token 过期
            return
          }
          await new Promise((r) => setTimeout(r, 2000))
        }
      }
      // 拉取始终失败（断网等）：照常允许上传，不能因为同步问题卡住学习
      setFavorites(lsGetArray('favorites'))
      setSyncReady(true)
      pullLockRef.current = false
    })()
  }, [auth, handleLogout])

  const handleLoginSuccess = useCallback((result) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(result))
    lastUploadedRef.current = {}
    setSyncReady(false)
    setAuth(result) // 触发上面的导入 + 拉取合并 effect
    toast(`欢迎回来，${result.user?.username || '同学'} 👋`, 'success')
  }, [])

  // ===== 上传：把当前账号空间所有 SYNC_KEYS 镜像到云端（未变化的跳过） =====
  const uploadAll = useCallback(async () => {
    if (!auth) return
    for (const key of SYNC_KEYS) {
      const raw = lsGetJSON(key, undefined)
      // 空值不上传：避免把 null 写进云端，否则会触发同步不收敛（无限刷新）
      if (raw === undefined || raw === null) continue
      if (lastUploadedRef.current[key] === JSON.stringify(raw)) continue
      try {
        await api.uploadUserData(auth.token, key, raw)
        lastUploadedRef.current[key] = JSON.stringify(raw)
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
  useEffect(() => {
    if (!auth || !syncReady) return
    const sync = async () => {
      try {
        const changed = await pullAndMerge(auth.token)
        if (changed) {
          // 拉到了新数据：更新界面状态，并把合并结果回传云端（两台设备最终一致）
          setFavorites(lsGetArray('favorites'))
          setDataVersion((v) => v + 1)
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
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
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
      <main className="main" id="main">
        {/* 每个 tab 各包一层错误边界：某个页面因脏数据崩掉时，
            导航栏和其它页面仍可用，且给出可恢复的提示而不是全白。 */}
        <ErrorBoundary key={tab}>
          <PageTransition key={`${tab}-${dataVersion}`}>
          {tab === 'home' && (
            <DailySentence
              onGo={() => setTab('cards')}
              onReview={() => setTab('wordbook')}
              onHelp={() => setHelpOpen(true)}
              onPatterns={() => setTab('patterns')}
              onTranslate={() => setTab('translation')}
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
          {tab === 'patterns' && <SentencePatterns />}
          {tab === 'translation' && <Translation />}
          {tab === 'wordbook' && (
            <WordBook
              words={words}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onGo={setTab}
            />
          )}
          </PageTransition>
        </ErrorBoundary>
      </main>
      <button
        className={`back-to-top ${scrollTopVisible ? 'back-to-top-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="回到顶部"
        title="回到顶部"
      >
        <Icon name="arrowUp" size={18} strokeWidth={2} />
      </button>
      <footer className="footer">
        <span className="footer-brand">英语学习网</span>
        <span className="footer-dot" />
        <span>A little progress every day</span>
      </footer>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <Toast />
    </div>
  )
}
