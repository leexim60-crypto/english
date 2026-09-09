// 加载 server/.env（文件不存在时静默跳过，部署时用环境变量或 .env 注入敏感信息）
try {
  process.loadEnvFile()
} catch {
  /* 本地开发没有 .env 也可以，直接读环境变量或用默认值 */
}

// 数据库与 Redis 配置（可用环境变量覆盖）
export const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '20061104',
  database: process.env.DB_NAME || 'english_learning',
}

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
}

export const PORT = Number(process.env.PORT || 3001)
