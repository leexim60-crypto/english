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
/**
 * 会随账号空间隔离、并同步到云端的学习数据。
 * 注意：这里的每一项都必须是“有实际内容”的数据；
 * 不要把 null/undefined 写进这些 key，否则同步无法收敛（详见 App.jsx 的 deepMerge）。
 */
export const SYNC_KEYS = [
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

/* ============================================================
   形状校验读取器
   ------------------------------------------------------------
   为什么需要：JSON.parse 只保证"是合法 JSON"，不保证"是对的类型"。
   下面任意一种情况都会让值类型与预期不符：
     · 云端同步把两个形状不同的值深度合并（对象 vs 数组）
     · 旧版本写的是另一种结构，新版直接读
     · 用户在 devtools 里手改 localStorage
     · 别处误写（例如把字符串写进本应是数组的 key）
   一旦类型不符，`arr.filter` / `arr.includes` / `Object.entries` 会直接抛
   TypeError，整个组件树崩掉 → 页面全白。

   所以：值存在但类型不对时，返回 fallback 并**就地修正**，
   不让坏数据继续留在本地、也不会再被同步回云端。
   ============================================================ */

/** 读取并校验为数组 */
export function lsGetArray(key, fallback = []) {
  const v = lsGetJSON(key, fallback)
  if (Array.isArray(v)) return v
  if (v !== null && v !== undefined) lsSet(key, fallback)
  return fallback
}

/** 读取并校验为纯对象（排除数组与 null） */
export function lsGetObject(key, fallback = {}) {
  const v = lsGetJSON(key, fallback)
  if (v !== null && typeof v === 'object' && !Array.isArray(v)) return v
  if (v !== null && v !== undefined) lsSet(key, fallback)
  return fallback
}

/** 读取并校验为 { [id]: string } 映射，逐项丢弃非字符串值 */
export function lsGetStringMap(key) {
  const obj = lsGetObject(key, {})
  const out = {}
  let dirty = false
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[k] = v
    else dirty = true
  }
  if (dirty) lsSet(key, out)
  return out
}

/* ---------- 供同步层调用的"净化器"：云端数据落地前先过一遍 ---------- */

const asArray = (v) => (Array.isArray(v) ? v : null)
const asObject = (v) => (v !== null && typeof v === 'object' && !Array.isArray(v) ? v : null)
const asStringMap = (v) => {
  const o = asObject(v)
  if (!o) return null
  const out = {}
  for (const [k, val] of Object.entries(o)) if (typeof val === 'string') out[k] = val
  return out
}

/** 每个同步 key 期望的形状。未列出的 key 不做限制。 */
export const SANITIZERS = {
  favorites: asArray,
  learnedWords: asArray,
  learnedPhrases: asArray,
  masteredPatterns: asArray,
  translationDone: asArray,
  wordReviewMeta: asObject,
  studyLog: asObject,
  translationDrafts: asStringMap,
}

/** 按 key 净化一个值；形状不符返回 null（调用方据此跳过） */
export function sanitize(key, value) {
  const fn = SANITIZERS[key]
  if (!fn) return value
  return fn(value)
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
