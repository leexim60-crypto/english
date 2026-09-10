/**
 * 生词本复习调度（简化版 SM-2 间隔重复）+ 学习打卡记录。
 * 学习数据按账号隔离存储（见 utils/storage.js）。
 *
 * 调度规则：
 *  - 认识：间隔翻倍（1 → 2 → 4 → 8 → ... 天，上限 60 天）
 *  - 不认识：重置为待复习（立即到期）
 */

import { lsGetJSON, lsSet } from './storage.js'

const META_KEY = 'wordReviewMeta'
const LOG_KEY = 'studyLog'
const DAY_MS = 86400000

function todayStr(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function loadMeta() {
  return lsGetJSON(META_KEY, {})
}

function saveMeta(meta) {
  lsSet(META_KEY, meta)
}

/** 记录一次复习结果 */
export function recordReview(id, known) {
  const meta = loadMeta()
  const m = meta[id] || { interval: 0, reps: 0, next: 0 }
  if (known) {
    m.reps = (m.reps || 0) + 1
    m.interval = m.interval === 0 ? 1 : Math.min(Math.round(m.interval * 2), 60)
  } else {
    m.reps = 0
    m.interval = 0
  }
  m.next = Date.now() + m.interval * DAY_MS
  meta[id] = m
  saveMeta(meta)
  touchToday()
}

/** 从生词本移除时清理调度数据 */
export function clearReview(id) {
  const meta = loadMeta()
  if (meta[id]) {
    delete meta[id]
    saveMeta(meta)
  }
}

/** 该词是否到了复习时间（没有记录 = 待复习） */
export function isDue(id) {
  const m = loadMeta()[id]
  return !m || !m.next || m.next <= Date.now()
}

/** 一批词里到期待复习的 id 列表 */
export function getDueIds(ids) {
  const meta = loadMeta()
  return (ids || []).filter((id) => {
    const m = meta[id]
    return !m || !m.next || m.next <= Date.now()
  })
}

/** 展示用的下次复习时间 */
export function getNextReviewText(id) {
  const m = loadMeta()[id]
  if (!m || !m.next || m.next <= Date.now()) return '待复习'
  const days = Math.max(1, Math.ceil((m.next - Date.now()) / DAY_MS))
  return days >= 60 ? '2 个月后' : `${days} 天后`
}

/** 记录今天有学习行为（打卡） */
export function touchToday() {
  const log = lsGetJSON(LOG_KEY, {})
  log[todayStr()] = true
  lsSet(LOG_KEY, log)
}

/** 连续打卡天数（今天没学也不断签，从昨天往回数） */
export function getStreak() {
  const log = lsGetJSON(LOG_KEY, {})
  if (!log) return 0
  let streak = 0
  const d = new Date()
  if (!log[todayStr()]) d.setDate(d.getDate() - 1) // 今天还没学不算断
  while (log[todayStr(d)]) {
    streak += 1
    d.setDate(d.getDate() - 1)
  }
  return streak
}
