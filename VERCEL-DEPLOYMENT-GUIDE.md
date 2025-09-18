# 🚀 Vercel 部署指南

## 📋 部署步骤

### 1. 后端API部署 (spend-money-api)

#### 步骤1：推送到GitHub
```bash
cd spend-money-api
git init
git add .
git commit -m "Initial commit: Spend Money API"
git remote add origin https://github.com/yourusername/spend-money-api.git
git push -u origin main
```

#### 步骤2：在Vercel中部署
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 连接GitHub仓库 `spend-money-api`
4. 选择项目并点击 "Deploy"

#### 步骤3：设置环境变量
在Vercel项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_Av2kguKCGjI6@ep-dry-poetry-ad5zyp6m-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require` | Neon数据库连接字符串 |
| `JWT_SECRET` | `66d0e5dc004031e36c907e45d16e0886db303f8c9c1ad1e7c83171bc212b56fc` | JWT密钥 |
| `PROJECT_PREFIX` | `spend_money` | 项目前缀 |
| `NODE_ENV` | `production` | 生产环境标识 |

#### 步骤4：重新部署
设置环境变量后，点击 "Redeploy" 重新部署项目。

### 2. 前端项目部署 (Spend Bill Gates Money)

#### 步骤1：更新环境变量
创建 `.env.production` 文件：
```env
VITE_API_BASE_URL=https://your-api-domain.vercel.app
```

#### 步骤2：推送到GitHub
```bash
cd "Spend Bill Gates Money"
git add .
git commit -m "Add comment system integration"
git push
```

#### 步骤3：在Vercel中重新部署
如果项目已经部署，Vercel会自动重新构建。

## 🔧 环境变量配置说明

### 本地开发
- **后端**：使用 `.env.local` 文件
- **前端**：不设置 `VITE_API_BASE_URL`，自动使用 `localhost:3000`

### 生产环境
- **后端**：在Vercel中设置环境变量
- **前端**：设置 `VITE_API_BASE_URL` 指向生产API

## 🎯 部署验证

### 验证后端API
```bash
curl https://your-api-domain.vercel.app/health
```
应该返回：
```json
{
  "status": "OK",
  "message": "游戏评论评分API运行正常",
  "project": "spend_money",
  "timestamp": "..."
}
```

### 验证前端功能
1. 访问游戏详情页
2. 检查评论评分功能
3. 测试管理后台登录

## ⚠️ 常见问题

### 1. 环境变量错误
- 确保在Vercel中设置了所有必要的环境变量
- 不要使用 `@` 引用格式，直接设置值

### 2. 数据库连接失败
- 检查Neon数据库是否正常运行
- 验证连接字符串是否正确
- 确保数据库允许外部连接

### 3. CORS错误
- 检查API的CORS配置
- 确保前端域名在允许列表中

## 🎉 部署完成

部署成功后，您将拥有：
- ✅ 完整的评论评分系统
- ✅ 管理后台功能
- ✅ 钱花完庆祝弹窗
- ✅ 多角色支持

---

**注意**：首次部署后请立即修改管理员密码！
