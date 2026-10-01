/**
 * 按账号隔离的本地存储层。
 * 所有学习数据（favorites/learnedWords/wordReviewMeta/learnedPhrases/studyLog）
 * 的读写都必须经过这里，不允许组件直接操作裸 localStorage key。
 *
 * 空间规则：
 *   已登录 → key 前缀 "u<userId>:"（每个账号独立空间，互不可见）
 *   未登录 → 无前缀（匿名空间）
 *
 * 登录时由 App 调用 importAnonymousData() 把匿名数据导入账号空间作为初始数据，
 * 之后账号空间与云端同步，与匿名空间再无关系。
 */
const AUTH_KEY = 'auth'
const SYNC_KEYS = [
  'favorites',
  'learnedWords',
  'wordReviewMeta',
  'learnedPhrases',
  'studyLog',
  'masteredPatterns',
  'translationDrafts',
  'translationDone',
]

/** 当前登录用户的数据空间前缀（未登录 = 匿名空间，无前缀） */
export function spacePrefix() {
  try {
    const a = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
    return a && a.user && a.user.id != null ? `u${a.user.id}:` : ''
  } catch {
    return ''
  }
}

/** 读（仅当前空间；账号空间无此 key 返回 null，不回落匿名空间，防止数据串账号） */
export function lsGet(key) {
  return localStorage.getItem(spacePrefix() + key)
}

/** 写（仅当前空间） */
export function lsSet(key, value) {
  localStorage.setItem(spacePrefix() + key, typeof value === 'string' ? value : JSON.stringify(value))
}

/** 读 JSON（解析失败返回 fallback） */
export function lsGetJSON(key, fallback = null) {
  try {
    const raw = lsGet(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

/** 首次登录此账号：若账号空间还是空的，把匿名空间数据导入作为初始数据 */
export function importAnonymousData(userId) {
  const p = `u${userId}:`
  // 账号空间已有任意数据 → 老用户，不导入
  if (SYNC_KEYS.some((k) => localStorage.getItem(p + k) !== null)) return false
  let imported = false
  for (const k of SYNC_KEYS) {
    const anon = localStorage.getItem(k)
    if (anon !== null) {
      localStorage.setItem(p + k, anon)
      imported = true
    }
  }
  return imported
}
