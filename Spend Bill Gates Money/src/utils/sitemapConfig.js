import { games } from '../data/games.js'
import { availableCharacters } from '../data/config.js'

// 生成站点地图数据
export function generateSitemapData() {
  const hostname = 'https://spendgatesmoney.com' // 替换为你的实际域名
  const currentDate = new Date().toISOString().split('T')[0]

  // 静态路由配置
  const staticRoutes = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: '/games',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: '/contact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      url: '/privacy-policy',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/terms-of-service',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/copyright',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/about',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    }
  ]

  // 生成角色页面路由（除了Bill Gates，因为他是首页）
  const characterRoutes = Object.values(availableCharacters)
    .filter(character => character.addressBar && character.addressBar !== 'bill-gates')
    .map(character => ({
      url: `/${character.addressBar}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    }))

  // 生成游戏详情页路由
  const gameRoutes = games.map(game => ({
    url: `/games/${game.addressBar}`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: 0.7
  }))

  // 合并所有路由
  return [...staticRoutes, ...characterRoutes, ...gameRoutes]
}

// 获取所有路由列表（用于vite插件配置）
export function getAllRoutes() {
  const staticRoutes = [
    '/',
    '/games',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/copyright',
    '/about'
  ]

  // 生成角色页面路由（除了Bill Gates）
  const characterRoutes = Object.values(availableCharacters)
    .filter(character => character.addressBar && character.addressBar !== 'bill-gates')
    .map(character => `/${character.addressBar}`)

  // 生成游戏详情页路由
  const gameRoutes = games.map(game => `/games/${game.addressBar}`)

  return [...staticRoutes, ...characterRoutes, ...gameRoutes]
} 