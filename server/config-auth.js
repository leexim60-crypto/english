// 认证相关配置：JWT 密钥必须用环境变量注入，
// 生产环境不设置 JWT_SECRET 时拒绝启动（防止用默认密钥被伪造 token）
export const config = {
  get jwtSecret() {
    const s = process.env.JWT_SECRET
    if (!s || s.length < 16) {
      throw new Error(
        '缺少 JWT_SECRET 环境变量（至少 16 位随机字符串）。' +
          '本地可写入 server/.env，部署平台在环境变量面板配置。'
      )
    }
    return s
  },
}

// 生成一个随机密钥的辅助命令：node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
