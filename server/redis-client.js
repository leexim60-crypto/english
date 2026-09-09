import Redis from 'ioredis'
import { redisConfig } from './config.js'

// Redis 客户端。即使 Redis 没启动也不让进程崩溃，
// 所有缓存操作失败时静默返回 null，接口自动降级为直查 MySQL。
export const redis = new Redis({
  ...redisConfig,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy: (times) => Math.min(times * 500, 3000),
})

redis.on('error', () => {
  // 静默处理连接错误，保持服务可用
})

export async function cacheGet(key) {
  try {
    return await redis.get(key)
  } catch {
    return null
  }
}

export async function cacheSet(key, value, ttlSeconds) {
  try {
    if (ttlSeconds) await redis.set(key, value, 'EX', ttlSeconds)
    else await redis.set(key, value)
  } catch {
    /* Redis 不可用时忽略 */
  }
}

export async function cacheHGetAll(key) {
  try {
    return await redis.hgetall(key)
  } catch {
    return null
  }
}

export async function cacheHIncrBy(key, field, by = 1) {
  try {
    return await redis.hincrby(key, field, by)
  } catch {
    return null
  }
}

export async function cacheExpire(key, ttlSeconds) {
  try {
    await redis.expire(key, ttlSeconds)
  } catch {
    /* ignore */
  }
}

export function redisAlive() {
  return redis.status === 'ready'
}
