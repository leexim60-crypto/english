# 后端服务（Express + MySQL + Redis）

## 目录结构

```
server/
├── index.js        # Express 主程序（API 路由）
├── seed.js         # 建库建表 + 导入 100 个单词
├── words-data.js   # 词库种子数据（100 词 + 每日一句）
├── db.js           # MySQL 连接池（mysql2）
├── redis-client.js # Redis 客户端封装（ioredis，失败自动降级）
└── config.js       # 数据库 / Redis 配置（可用环境变量覆盖）
```

## 快速启动

前置条件：本机已安装并启动 **MySQL**（root / 20061104）和 **Redis**（默认 6379）。

```bash
cd server
npm install       # 安装依赖
npm run seed      # 建库建表 + 导入词库（可重复执行）
npm start         # 启动后端，监听 http://localhost:3001
```

然后在项目根目录 `npm run dev` 启动前端即可，Vite 已配置 `/api` 代理到 3001 端口。

## API 一览

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET  | `/api/health` | 健康检查（含 Redis 状态） |
| GET  | `/api/words` | 全部单词 + 每日一句（Redis 缓存 1 小时） |
| GET  | `/api/stats` | 词汇总量统计 |
| GET  | `/api/quiz/daily` | 每日测验题（Redis 按天缓存，同一天题目固定） |
| POST | `/api/quiz/submit` | 提交成绩：MySQL 持久化 + Redis 更新今日统计 |
| GET  | `/api/quiz/stats` | 今日小测试统计（挑战人次 / 最高分 / 平均分） |

## Redis 的用途

1. **缓存词库**：`words:all`，TTL 1 小时，减少 MySQL 查询。
2. **每日测验缓存**：`quiz:daily:YYYY-MM-DD`，当天所有人共享同一套题，TTL 30 小时自动过期。
3. **今日统计**：`quiz:stats:YYYY-MM-DD`（Hash：attempts / totalScore / bestScore），
   测验页展示"今日挑战人次、最高分、平均分"。

Redis 未启动时服务**不会崩溃**：缓存读写静默失败，接口自动降级为直查 MySQL。

## 配置覆盖

```bash
DB_HOST=127.0.0.1 DB_PORT=3306 DB_USER=root DB_PASSWORD=xxx DB_NAME=english_learning \
REDIS_HOST=127.0.0.1 REDIS_PORT=6379 PORT=3001 npm start
```
