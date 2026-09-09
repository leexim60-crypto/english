// 建库建表 + 导入词库：
//   - core 精选词库（100 词，带精心编写的例句）
//   - cet6 六级词库（3992 词，来自开源数据 kajweb/dict）
// 用法：npm run seed  （需要 MySQL 已启动，账号密码见 config.js）
import mysql from 'mysql2/promise'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dbConfig } from './config.js'
import { wordsData, sentencesData } from './words-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  // 云数据库（如 TiDB Serverless）要求 TLS：非本地地址自动开启
  const useTLS = !['localhost', '127.0.0.1'].includes(dbConfig.host)
  const conn = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
    ...(useTLS ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {}),
  })
  console.log('✅ 已连接 MySQL')

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     USE \`${dbConfig.database}\`;

     CREATE TABLE IF NOT EXISTS words (
       id INT PRIMARY KEY,
       word VARCHAR(64) NOT NULL,
       phonetic VARCHAR(64) DEFAULT '',
       meaning VARCHAR(512) NOT NULL,
       level TINYINT NOT NULL DEFAULT 1,
       example VARCHAR(512) DEFAULT '',
       example_cn VARCHAR(512) DEFAULT '',
       book VARCHAR(16) NOT NULL DEFAULT 'core',
       INDEX idx_level (level),
       INDEX idx_book (book)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

     CREATE TABLE IF NOT EXISTS sentences (
       id INT PRIMARY KEY,
       en VARCHAR(255) NOT NULL,
       cn VARCHAR(255) NOT NULL,
       author VARCHAR(64) DEFAULT ''
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

     CREATE TABLE IF NOT EXISTS quiz_results (
       id INT AUTO_INCREMENT PRIMARY KEY,
       quiz_date DATE NOT NULL,
       book VARCHAR(16) NOT NULL DEFAULT 'core',
       score INT NOT NULL,
       total INT NOT NULL DEFAULT 10,
       accuracy INT NOT NULL DEFAULT 0,
       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
       INDEX idx_date (quiz_date)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

     CREATE TABLE IF NOT EXISTS phrases (
       id INT PRIMARY KEY,
       phrase VARCHAR(128) NOT NULL,
       translation VARCHAR(255) NOT NULL,
       word VARCHAR(64) DEFAULT ''
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  )

  // 兼容旧版本表结构：给已存在的 words / quiz_results 补 book 列
  try {
    await conn.query("ALTER TABLE words ADD COLUMN book VARCHAR(16) NOT NULL DEFAULT 'core', ADD INDEX idx_book (book)")
    console.log('✅ 已为 words 表补充 book 列')
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') console.log('   words 表 book 列已存在，跳过')
  }
  try {
    await conn.query("ALTER TABLE quiz_results ADD COLUMN book VARCHAR(16) NOT NULL DEFAULT 'core'")
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') console.log('   quiz_results 表 book 列已存在，跳过')
  }
  console.log('✅ 数据库和表已就绪')

  // ===== 1. 精选词库（id 1-100，book='core'）=====
  for (const w of wordsData) {
    await conn.execute(
      `INSERT INTO words (id, word, phonetic, meaning, level, example, example_cn, book)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'core')
       ON DUPLICATE KEY UPDATE
         word=VALUES(word), phonetic=VALUES(phonetic), meaning=VALUES(meaning),
         level=VALUES(level), example=VALUES(example), example_cn=VALUES(example_cn), book='core'`,
      [w.id, w.word, w.phonetic, w.meaning, w.level, w.example, w.exampleCn]
    )
  }
  console.log(`✅ 已导入精选词库 ${wordsData.length} 个单词`)

  // ===== 2. 六级词库（id 1001 起，book='cet6'）=====
  const cet6File = path.join(__dirname, 'data', 'cet6-words.json')
  if (fs.existsSync(cet6File)) {
    const cet6 = JSON.parse(fs.readFileSync(cet6File, 'utf8'))
    // 先清掉旧的 cet6 数据再整体导入（保证与数据文件一致）
    await conn.query("DELETE FROM words WHERE book = 'cet6'")
    const BATCH = 500
    for (let i = 0; i < cet6.length; i += BATCH) {
      const batch = cet6.slice(i, i + BATCH)
      const values = []
      const params = []
      batch.forEach((w, j) => {
        values.push('(?, ?, ?, ?, ?, ?, ?, ?)')
        params.push(1001 + i + j, w.word, w.phonetic, w.meaning, 1, w.example, w.exampleCn, 'cet6')
      })
      await conn.execute(
        `INSERT INTO words (id, word, phonetic, meaning, level, example, example_cn, book)
         VALUES ${values.join(',')}
         ON DUPLICATE KEY UPDATE
           word=VALUES(word), phonetic=VALUES(phonetic), meaning=VALUES(meaning),
           example=VALUES(example), example_cn=VALUES(example_cn), book='cet6'`,
        params
      )
    }
    console.log(`✅ 已导入六级词库 ${cet6.length} 个单词`)
  } else {
    console.log('⚠️  未找到 data/cet6-words.json，跳过六级词库')
  }

  // ===== 3. 短语库（来自六级词库，22203 条）=====
  const phrasesFile = path.join(__dirname, 'data', 'cet6-phrases.json')
  if (fs.existsSync(phrasesFile)) {
    const phrases = JSON.parse(fs.readFileSync(phrasesFile, 'utf8'))
    await conn.query('DELETE FROM phrases')
    const BATCH = 1000
    for (let i = 0; i < phrases.length; i += BATCH) {
      const batch = phrases.slice(i, i + BATCH)
      const values = []
      const params = []
      batch.forEach((p, j) => {
        values.push('(?, ?, ?, ?)')
        params.push(i + j + 1, p.phrase, p.translation, p.word || '')
      })
      await conn.execute(
        `INSERT INTO phrases (id, phrase, translation, word) VALUES ${values.join(',')}`,
        params
      )
    }
    console.log(`✅ 已导入短语库 ${phrases.length} 条`)
  } else {
    console.log('⚠️  未找到 data/cet6-phrases.json，跳过短语库')
  }

  // ===== 4. 每日一句 =====
  for (const s of sentencesData) {
    await conn.execute(
      `INSERT INTO sentences (id, en, cn, author) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE en=VALUES(en), cn=VALUES(cn), author=VALUES(author)`,
      [s.id, s.en, s.cn, s.author]
    )
  }
  console.log(`✅ 已导入 ${sentencesData.length} 条每日一句`)

  await conn.end()
  console.log('🎉 种子数据导入完成！现在可以运行 npm start 启动后端了。')
}

main().catch((err) => {
  console.error('❌ 种子导入失败：', err.message)
  console.error('   请确认 MySQL 已启动，且 config.js 中的账号密码正确。')
  process.exit(1)
})
