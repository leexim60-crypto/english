import mysql from 'mysql2/promise'
import { dbConfig } from './config.js'

// TiDB Serverless 等云数据库强制要求 TLS：非本地地址自动开启，
// 也可用环境变量 DB_SSL=0/1 显式控制
const useTLS =
  process.env.DB_SSL !== undefined
    ? process.env.DB_SSL === '1'
    : !['localhost', '127.0.0.1'].includes(dbConfig.host)

export const pool = mysql.createPool({
  ...dbConfig,
  ...(useTLS ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {}),
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
})

// 统一的 SQL 查询封装，出错时抛出异常由路由层处理
export async function query(sql, params) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

// 数据库行 -> 前端字段（camelCase）
export function rowToWord(r) {
  return {
    id: r.id,
    word: r.word,
    phonetic: r.phonetic,
    meaning: r.meaning,
    level: r.level,
    example: r.example,
    exampleCn: r.example_cn,
  }
}
