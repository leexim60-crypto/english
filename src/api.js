// 统一的请求封装：带超时控制，后端没启动时抛错由调用方兜底
const BASE = '/api'

export async function fetchWithTimeout(path, options = {}, timeout = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(`${BASE}${path}`, {
      // 注意：...options 必须在 headers 之前展开，否则 options.headers 会覆盖合并后的
      // headers，丢失 Content-Type，导致带 Authorization 的 POST 上传静默失败（HTTP 400）
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  // ===== 用户认证 =====
  register: (username, password, email) =>
    fetchWithTimeout(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ username, password, email }) }
    ),
  login: (username, password) =>
    fetchWithTimeout(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ username, password }) }
    ),
  getUserData: (token) =>
    fetchWithTimeout('/user/data', { headers: { Authorization: `Bearer ${token}` } }, 8000),
  uploadUserData: (token, key, value) =>
    fetchWithTimeout(
      '/user/data',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key, value }),
      },
      8000
    ),
  // 精选词库 + 每日一句 + 分册统计
  getWords: () => fetchWithTimeout('/words', {}, 5000),
  // 随机取一批单词（六级卡片流）
  getRandomWords: (book = 'cet6', size = 50) =>
    fetchWithTimeout(`/words/random?book=${book}&size=${size}`, {}, 8000),
  // 按 id 批量查词（生词本）
  getWordsByIds: (ids) =>
    fetchWithTimeout(
      '/words/by-ids',
      { method: 'POST', body: JSON.stringify({ ids }) },
      8000
    ),
  // 每日测验（book: 'core' | 'cet6'）
  getDailyQuiz: (book = 'core') => fetchWithTimeout(`/quiz/daily?book=${book}`, {}, 8000),
  submitQuiz: (score, total, book = 'core') =>
    fetchWithTimeout('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ score, total, book }),
    }),
  getQuizStats: (book = 'core') => fetchWithTimeout(`/quiz/stats?book=${book}`),
  // 短语
  getDailyPhrase: () => fetchWithTimeout('/phrases/daily'),
  getRandomPhrases: (size = 30) => fetchWithTimeout(`/phrases/random?size=${size}`, {}, 8000),
  getPhrasesByIds: (ids) =>
    fetchWithTimeout(
      '/phrases/by-ids',
      { method: 'POST', body: JSON.stringify({ ids }) },
      8000
    ),
}
