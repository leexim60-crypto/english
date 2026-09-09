import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { PORT } from './config.js'
import { query, rowToWord } from './db.js'
import {
  cacheGet,
  cacheSet,
  cacheHGetAll,
  cacheHIncrBy,
  cacheExpire,
  redisAlive,
} from './redis-client.js'

const app = express()
app.use(cors())
app.use(express.json())

// ===== 生产环境：托管前端构建产物（dist/），单端口同时服务页面和 API =====
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  // SPA 回退：非 /api 路径统一返回 index.html，支持前端路由
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

// ===== 工具 =====
function today() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function normalizeBook(b) {
  return b === 'cet6' ? 'cet6' : 'core'
}

// 可复现的伪随机（同一天所有人拿到的题目一样）
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle(arr, rand) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const QUIZ_SIZE = 10

// ===== 健康检查 =====
app.get('/api/health', (req, res) => {
  res.json({ ok: true, redis: redisAlive() })
})

// ===== 精选词库 + 每日一句 + 总量统计（Redis 缓存 1 小时） =====
app.get('/api/words', async (req, res) => {
  try {
    const cacheKey = 'words:core'
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return res.json({ source: 'cache', ...JSON.parse(cached) })
    }
    const rows = await query("SELECT * FROM words WHERE book = 'core' ORDER BY id", [])
    const words = rows.map(rowToWord)
    const sentenceRows = await query('SELECT * FROM sentences ORDER BY id', [])
    const sentences = sentenceRows.map((r) => ({ id: r.id, en: r.en, cn: r.cn, author: r.author }))
    const countRows = await query(
      "SELECT book, COUNT(*) AS c FROM words GROUP BY book",
      []
    )
    const counts = { core: 0, cet6: 0 }
    for (const r of countRows) counts[r.book] = r.c
    const payload = { words, sentences, counts }
    await cacheSet(cacheKey, JSON.stringify(payload), 3600)
    res.json({ source: 'db', ...payload })
  } catch (err) {
    console.error('[/api/words]', err.message)
    res.status(503).json({ error: '数据库暂时不可用，请稍后再试' })
  }
})

// ===== 随机取一批单词（六级卡片流用，不缓存，每次随机） =====
app.get('/api/words/random', async (req, res) => {
  try {
    const book = normalizeBook(req.query.book)
    const size = Math.min(Math.max(Number(req.query.size) || 50, 1), 100)
    // 注：TiDB 的预处理协议不支持 LIMIT 占位符，size 已钳制为 1-100 的整数，直接内联安全
    const rows = await query(
      `SELECT * FROM words WHERE book = ? ORDER BY RAND() LIMIT ${Number(size)}`,
      [book]
    )
    res.json({ words: rows.map(rowToWord) })
  } catch (err) {
    console.error('[/api/words/random]', err.message)
    res.status(503).json({ error: '暂时无法获取单词' })
  }
})

// ===== 按 id 批量查词（生词本用） =====
app.post('/api/words/by-ids', async (req, res) => {
  try {
    let ids = req.body?.ids
    if (!Array.isArray(ids)) return res.status(400).json({ error: '参数不合法' })
    ids = [...new Set(ids.map(Number).filter((n) => Number.isInteger(n) && n > 0))].slice(0, 500)
    if (ids.length === 0) return res.json({ words: [] })
    const placeholders = ids.map(() => '?').join(',')
    const rows = await query(`SELECT * FROM words WHERE id IN (${placeholders})`, ids)
    res.json({ words: rows.map(rowToWord) })
  } catch (err) {
    console.error('[/api/words/by-ids]', err.message)
    res.status(503).json({ error: '暂时无法获取单词' })
  }
})

// ===== 短语：每日一条（Redis 按天缓存） =====
app.get('/api/phrases/daily', async (req, res) => {
  try {
    const date = today()
    const cacheKey = `phrase:daily:${date}`
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return res.json({ source: 'cache', ...JSON.parse(cached) })
    }
    const totalRows = await query('SELECT COUNT(*) AS c FROM phrases', [])
    const total = totalRows[0].c
    if (total === 0) return res.json({ phrase: null })
    // 日期种子取模：同一天所有人看到同一条
    const seed = Number(date.replace(/-/g, ''))
    // offset 由日期取模得出，为非负整数，内联安全（TiDB 不支持 LIMIT 占位符）
    const offset = seed % total
    const rows = await query(`SELECT * FROM phrases LIMIT ${Number(offset)}, 1`, [])
    const payload = { date, total, phrase: rows[0] || null }
    await cacheSet(cacheKey, JSON.stringify(payload), 30 * 3600)
    res.json({ source: 'fresh', ...payload })
  } catch (err) {
    console.error('[/api/phrases/daily]', err.message)
    res.status(503).json({ error: '短语暂时不可用' })
  }
})

// ===== 短语：随机一批（浏览/挑选学习用） =====
app.get('/api/phrases/random', async (req, res) => {
  try {
    const size = Math.min(Math.max(Number(req.query.size) || 30, 1), 100)
    const rows = await query(`SELECT * FROM phrases ORDER BY RAND() LIMIT ${Number(size)}`, [])
    const totalRows = await query('SELECT COUNT(*) AS c FROM phrases', [])
    res.json({ phrases: rows, total: totalRows[0].c })
  } catch (err) {
    console.error('[/api/phrases/random]', err.message)
    res.status(503).json({ error: '暂时无法获取短语' })
  }
})

// ===== 短语：按 id 批量查（复习已选短语用） =====
app.post('/api/phrases/by-ids', async (req, res) => {
  try {
    let ids = req.body?.ids
    if (!Array.isArray(ids)) return res.status(400).json({ error: '参数不合法' })
    ids = [...new Set(ids.map(Number).filter((n) => Number.isInteger(n) && n > 0))].slice(0, 500)
    if (ids.length === 0) return res.json({ phrases: [] })
    const placeholders = ids.map(() => '?').join(',')
    const rows = await query(`SELECT * FROM phrases WHERE id IN (${placeholders})`, ids)
    res.json({ phrases: rows })
  } catch (err) {
    console.error('[/api/phrases/by-ids]', err.message)
    res.status(503).json({ error: '暂时无法获取短语' })
  }
})

// ===== 统计 =====
app.get('/api/stats', async (req, res) => {
  try {
    const countRows = await query('SELECT book, COUNT(*) AS c FROM words GROUP BY book', [])
    const counts = { core: 0, cet6: 0 }
    for (const r of countRows) counts[r.book] = r.c
    res.json({ counts, total: counts.core + counts.cet6 })
  } catch (err) {
    res.status(503).json({ error: '数据库暂时不可用' })
  }
})

// ===== 每日测验（按词书：core 每日固定题；cet6 每次随机） =====
app.get('/api/quiz/daily', async (req, res) => {
  try {
    const book = normalizeBook(req.query.book)
    const date = today()
    const cacheKey = `quiz:daily:${book}:${date}`
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return res.json({ source: 'cache', date, book, quiz: JSON.parse(cached) })
    }

    let poolRows
    if (book === 'cet6') {
      // 六级词池大，直接随机抽 40 题（10 道题 + 干扰项池）
      poolRows = await query(
        `SELECT * FROM words WHERE book = 'cet6' ORDER BY RAND() LIMIT ${Number(QUIZ_SIZE * 4)}`,
        []
      )
    } else {
      poolRows = await query("SELECT * FROM words WHERE book = 'core' ORDER BY id", [])
    }
    const words = poolRows.map(rowToWord)
    if (words.length < QUIZ_SIZE + 3) {
      return res.status(500).json({ error: '词库数量不足，请先运行 npm run seed' })
    }

    let picked
    if (book === 'cet6') {
      picked = words.slice(0, QUIZ_SIZE)
    } else {
      // 用日期作为随机种子：同一天题目固定
      const seed = Number(date.replace(/-/g, ''))
      picked = seededShuffle(words, mulberry32(seed)).slice(0, QUIZ_SIZE)
    }

    const quiz = picked.map((w, qi) => {
      const others = words.filter((o) => o.id !== w.id)
      const rand = mulberry32(Date.now() + qi * 131 + w.id)
      const wrong = seededShuffle(others, rand).slice(0, 3)
      const options = seededShuffle([...wrong, w], rand).map((o) => ({
        id: o.id,
        meaning: o.meaning,
      }))
      return {
        question: {
          id: w.id,
          word: w.word,
          phonetic: w.phonetic,
          example: w.example,
          exampleCn: w.exampleCn,
          meaning: w.meaning,
        },
        options,
        answerId: w.id,
      }
    })

    if (book === 'core') {
      // 仅精选词库按天缓存（题目固定）；六级每次随机不缓存
      await cacheSet(cacheKey, JSON.stringify(quiz), 30 * 3600)
      res.json({ source: 'fresh', date, book, quiz })
    } else {
      res.json({ source: 'fresh', date, book, quiz })
    }
  } catch (err) {
    console.error('[/api/quiz/daily]', err.message)
    res.status(503).json({ error: '暂时无法生成测验，请稍后再试' })
  }
})

// ===== 提交成绩：MySQL 持久化 + Redis 统计今日小测试 =====
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const score = Number(req.body?.score)
    const total = Number(req.body?.total) || QUIZ_SIZE
    const book = normalizeBook(req.body?.book)
    if (!Number.isFinite(score) || score < 0 || score > total) {
      return res.status(400).json({ error: '参数不合法' })
    }
    const accuracy = Math.round((score / total) * 100)

    // MySQL 永久保存每一次成绩
    await query(
      'INSERT INTO quiz_results (quiz_date, book, score, total, accuracy) VALUES (CURDATE(), ?, ?, ?, ?)',
      [book, score, total, accuracy]
    )

    // Redis 实时统计：今日挑战人数 / 总分 / 最高分（按词书分别统计）
    const statsKey = `quiz:stats:${book}:${today()}`
    await cacheHIncrBy(statsKey, 'attempts', 1)
    await cacheHIncrBy(statsKey, 'totalScore', score)
    const cur = await cacheHGetAll(statsKey)
    if (cur && Number(cur.bestScore || 0) < score) {
      try {
        const { redis } = await import('./redis-client.js')
        await redis.hset(statsKey, 'bestScore', score)
      } catch {
        /* ignore */
      }
    }
    await cacheExpire(statsKey, 7 * 86400)

    const stats = await getQuizStatsFromRedis(statsKey)
    res.json({ ...stats, book })
  } catch (err) {
    console.error('[/api/quiz/submit]', err.message)
    res.status(503).json({ error: '成绩保存失败' })
  }
})

async function getQuizStatsFromRedis(key) {
  const h = await cacheHGetAll(key)
  if (h && h.attempts) {
    const attempts = Number(h.attempts)
    const totalScore = Number(h.totalScore || 0)
    return {
      attempts,
      bestScore: Number(h.bestScore || 0),
      avgScore: attempts ? Math.round((totalScore / attempts) * 10) / 10 : 0,
    }
  }
  return null
}

// ===== 今日小测试统计（测验页展示用） =====
app.get('/api/quiz/stats', async (req, res) => {
  const book = normalizeBook(req.query.book)
  const key = `quiz:stats:${book}:${today()}`
  try {
    const stats = await getQuizStatsFromRedis(key)
    if (stats) return res.json({ source: 'cache', date: today(), book, ...stats })
  } catch {
    /* fallthrough */
  }
  // Redis 不可用时降级查 MySQL
  try {
    const rows = await query(
      'SELECT COUNT(*) AS attempts, COALESCE(MAX(score),0) AS best, COALESCE(AVG(score),0) AS avg FROM quiz_results WHERE quiz_date = CURDATE() AND book = ?',
      [book]
    )
    const r = rows[0]
    res.json({
      source: 'db',
      date: today(),
      book,
      attempts: r.attempts,
      bestScore: r.best,
      avgScore: Math.round(r.avg * 10) / 10,
    })
  } catch (err) {
    res.status(503).json({ error: '统计暂时不可用' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动: http://localhost:${PORT}`)
  console.log(`   Redis 状态: ${redisAlive() ? '已连接' : '未连接（接口将自动降级）'}`)
})
