# 🚀 部署检查清单

## 📋 部署配置

### 后端API (spend-money-api → spend-money-api.vercel.app)

#### Vercel环境变量设置：
```
DATABASE_URL = postgresql://neondb_owner:npg_Av2kguKCGjI6@ep-dry-poetry-ad5zyp6m-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET = 66d0e5dc004031e36c907e45d16e0886db303f8c9c1ad1e7c83171bc212b56fc
PROJECT_PREFIX = spend_money
NODE_ENV = production
```

#### CORS已配置支持的域名：
- ✅ `https://spendgatesmoney.com`
- ✅ `https://www.spendgatesmoney.com`
- ✅ `https://spend-bill-gates-money.vercel.app`
- ✅ `http://localhost:5173` (本地开发)

### 前端 (Spend Bill Gates Money → spendgatesmoney.com)

#### 生产环境配置：
- ✅ `.env.production` 已创建
- ✅ `VITE_API_BASE_URL=https://spend-money-api.vercel.app`

#### 本地开发配置：
- ✅ 不设置 `VITE_API_BASE_URL`，自动使用 `localhost:3000`

## 🔧 环境切换逻辑

### 前端API地址选择：
```javascript
// 1. 如果设置了 VITE_API_BASE_URL 环境变量，使用它
// 2. 如果是本地开发环境，使用 localhost:3000
// 3. 否则使用默认生产环境API
```

### 实际效果：
- **本地开发**: `localhost:5173` → `localhost:3000` → 共享数据库
- **生产环境**: `spendgatesmoney.com` → `spend-money-api.vercel.app` → 共享数据库

## ✅ 部署验证

### 1. 后端API验证
```bash
curl https://spend-money-api.vercel.app/health
```
期望返回：
```json
{
  "status": "OK",
  "message": "游戏评论评分API运行正常",
  "project": "spend_money"
}
```

### 2. 前端功能验证
- ✅ 游戏详情页评论功能
- ✅ 管理后台登录 (admin/admin123)
- ✅ 钱花完弹窗效果

## 🎯 数据库隔离

- **表名**: `spend_money_feedback`
- **项目前缀**: `spend_money`
- **与其他项目完全隔离**

## 🎉 部署完成

现在系统支持：
- ✅ 本地开发和生产环境无缝切换
- ✅ 共享数据库，数据隔离
- ✅ 完整的评论评分功能
- ✅ 管理后台系统
- ✅ 钱花完庆祝效果

部署后立即修改管理员密码！
