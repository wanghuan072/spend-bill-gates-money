/**
 * Spend Money API 项目配置
 */

export const CONFIG = {
  // 🔧 核心配置
  
  // 项目前缀 (全局唯一标识)
  PROJECT_PREFIX: 'spend_money',
  
  // 生产环境域名
  API_DOMAIN: 'https://spend-money-api.vercel.app',
  FRONTEND_DOMAIN: 'https://spendgatesmoney.com',
  
  // 项目信息
  PROJECT_NAME: 'Spend Bill Gates Money - 评论评分系统',
  PROJECT_DESCRIPTION: '比尔·盖茨花钱游戏的评论评分管理平台',
  
  // 🔧 可选配置
  
  // 本地开发端口
  LOCAL_API_PORT: 3000,
  LOCAL_FRONTEND_PORT: 5173,
  
  // 管理员默认密码
  DEFAULT_ADMIN_PASSWORD: 'admin123',
  
  // 数据库配置
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'spend-money-secret-key-2024'
};

// 🎮 游戏配置 - 对应 Spend Bill Gates Money 的游戏数据
export const GAMES_CONFIG = {
  // 这里的 addressBar 应该与 Spend Bill Gates Money/src/data/games.js 中的 addressBar 一致
  supportedGames: [
    // 游戏数据将从前端项目的 games.js 中获取
    // 这里只做配置说明，实际游戏列表由前端项目管理
  ]
};

// 📝 部署说明:
// 1. 设置环境变量 DATABASE_URL (Neon PostgreSQL)
// 2. 设置环境变量 JWT_SECRET 
// 3. 运行: npm run setup (初始化数据库和管理员账户)
// 4. 部署到 Vercel
