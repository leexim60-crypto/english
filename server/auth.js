// 用户认证：注册 / 登录 / JWT 校验
// - 密码用 bcrypt 哈希存储（数据库泄露也拿不到明文）
// - 登录态用 JWT（30 天有效期），前端存 localStorage 实现长期免登录
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from './db.js'
import { config } from './config-auth.js'

// 用户表 + 用户数据表（幂等创建，老库自动补表）
export async function ensureAuthTables() {
  await query(
    `CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(32) NOT NULL UNIQUE,
       password_hash VARCHAR(100) NOT NULL,
       email VARCHAR(128) DEFAULT '',
       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  )
  await query(
    `CREATE TABLE IF NOT EXISTS user_data (
       user_id INT NOT NULL,
       data_key VARCHAR(32) NOT NULL,
       data_json MEDIUMTEXT NOT NULL,
       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       PRIMARY KEY (user_id, data_key)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  )
}

// ===== 工具 =====
function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, {
    expiresIn: '30d',
  })
}

const USERNAME_RE = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,16}$/

// ===== 注册 =====
export async function register(username, password, email = '') {
  username = String(username || '').trim()
  password = String(password || '')
  if (!USERNAME_RE.test(username)) {
    throw Object.assign(new Error('用户名需 2-16 位，仅限中英文、数字、下划线'), { status: 400 })
  }
  if (password.length < 6 || password.length > 64) {
    throw Object.assign(new Error('密码需 6-64 位'), { status: 400 })
  }
  const [exists] = await query('SELECT id FROM users WHERE username = ?', [username])
  if (exists) {
    throw Object.assign(new Error('用户名已被注册'), { status: 409 })
  }
  const hash = await bcrypt.hash(password, 10)
  const r = await query('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)', [
    username,
    hash,
    email ? String(email).slice(0, 128) : '',
  ])
  const [user] = await query('SELECT id, username, email, created_at FROM users WHERE id = ?', [
    r.insertId,
  ])
  return { user, token: signToken(user) }
}

// ===== 登录 =====
export async function login(username, password) {
  username = String(username || '').trim()
  const [user] = await query('SELECT * FROM users WHERE username = ?', [username])
  if (!user) throw Object.assign(new Error('用户名或密码错误'), { status: 401 })
  const ok = await bcrypt.compare(String(password || ''), user.password_hash)
  if (!ok) throw Object.assign(new Error('用户名或密码错误'), { status: 401 })
  const safe = { id: user.id, username: user.username, email: user.email }
  return { user: safe, token: signToken(safe) }
}

// ===== JWT 校验中间件（可选鉴权：有效则挂 user，无效则忽略） =====
export function authOptional(req, _res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (token) {
    try {
      req.user = jwt.verify(token, config.jwtSecret)
    } catch {
      /* token 过期/伪造：按未登录处理 */
    }
  }
  next()
}

// ===== JWT 校验中间件（强制鉴权：无效直接 401） =====
export function authRequired(req, res, next) {
  authOptional(req, res, () => {
    if (!req.user) return res.status(401).json({ error: '请先登录' })
    next()
  })
}
