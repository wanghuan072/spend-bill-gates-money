/**
 * SEO工具类 - 管理页面的Title, Description, Keywords
 */

// 默认TDK设置
const defaultSEO = {
  title: 'Spend Bill Gates Money - Interactive Wealth Simulation Game',
  description: 'Experience what it\'s like to spend Bill Gates\' fortune in this interactive simulation game. Buy luxury items, invest in companies, and see how far $100+ billion can go.',
  keywords: 'bill gates money, wealth simulation, interactive game, billionaire spending, luxury items, investment game'
}

// 默认社交媒体设置
const defaultSocial = {
  siteName: 'Spend Bill Gates Money',
  type: 'website',
  image: '/og-image.webp',
  imageAlt: 'Spend Bill Gates Money - Interactive Wealth Simulation',
  twitterCard: 'summary_large_image',
  twitterSite: '@wealthgame',
  twitterCreator: '@wealthgame'
}

/**
 * 设置页面TDK和社交媒体标签
 * @param {Object} seo - SEO对象，包含title, description, keywords
 * @param {string} canonicalUrl - 规范URL（可选）
 */
export function setPageSEO(seo = {}, canonicalUrl = null) {
  const { title, description, keywords } = { ...defaultSEO, ...seo }
  
  // 设置页面标题
  document.title = title
  
  // 设置meta description
  setMetaTag('description', description)
  
  // 设置meta keywords
  setMetaTag('keywords', keywords)
  
  // 设置canonical URL
  if (canonicalUrl) {
    setCanonicalUrl(canonicalUrl)
  }
  
  // 统一设置社交媒体标签
  setSocialTags(title, description)
}

/**
 * 设置社交媒体标签
 * @param {string} title - 页面标题
 * @param {string} description - 页面描述
 * @param {string} type - 内容类型，默认为website
 */
export function setSocialTags(title, description, type = 'website') {
  // Open Graph标签
  setMetaTag('og:title', title)
  setMetaTag('og:description', description)
  setMetaTag('og:image', defaultSocial.image)
  setMetaTag('og:image:alt', defaultSocial.imageAlt)
  setMetaTag('og:type', type)
  setMetaTag('og:url', window.location.href)
  setMetaTag('og:site_name', defaultSocial.siteName)
  
  // Twitter Card标签
  setMetaTag('twitter:card', defaultSocial.twitterCard)
  setMetaTag('twitter:site', defaultSocial.twitterSite)
  setMetaTag('twitter:creator', defaultSocial.twitterCreator)
  setMetaTag('twitter:title', title)
  setMetaTag('twitter:description', description)
  setMetaTag('twitter:image', defaultSocial.image)
  setMetaTag('twitter:image:alt', defaultSocial.imageAlt)
}

/**
 * 设置meta标签
 * @param {string} name - meta标签的name或property属性
 * @param {string} content - meta标签的content属性
 */
function setMetaTag(name, content) {
  // 先查找已存在的标签
  let metaTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
  
  if (!metaTag) {
    // 如果不存在，创建新标签
    metaTag = document.createElement('meta')
    // 判断是property还是name属性
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      metaTag.setAttribute('property', name)
    } else {
      metaTag.setAttribute('name', name)
    }
    document.head.appendChild(metaTag)
  }
  
  // 更新content属性
  metaTag.setAttribute('content', content)
}

/**
 * 设置canonical URL
 * @param {string} url - 规范URL
 */
function setCanonicalUrl(url) {
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  
  if (!canonicalLink) {
    // 如果不存在，创建新标签
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  
  // 更新href属性
  canonicalLink.setAttribute('href', url)
}

/**
 * 从路由meta中获取SEO信息
 * @param {Object} route - Vue路由对象
 * @returns {Object} SEO对象
 */
export function getSEOFromRoute(route) {
  if (route.meta) {
    return {
      title: route.meta.title,
      description: route.meta.description,
      keywords: route.meta.keywords
    }
  }
  return null
}

/**
 * 为游戏详情页面设置动态TDK
 * @param {Object} game - 游戏对象
 */
export function setGameDetailPageSEO(game) {
  if (!game) return
  
  const seo = game.seo || {}
  const defaultTitle = `${game.title} - Interactive Game`
  const defaultDescription = game.description || 'Play this interactive game and experience the thrill of spending money.'
  const defaultKeywords = 'interactive game, online game, browser game, simulation game'
  
  const title = seo.title || defaultTitle
  const description = seo.description || defaultDescription
  const keywords = seo.keywords || defaultKeywords
  
  // 生成canonical URL
  const baseUrl = 'https://spendgatesmoney.com'
  const canonicalUrl = `${baseUrl}/games/${game.addressBar}`
  
  // 设置基础SEO和社交媒体标签
  setPageSEO({
    title,
    description,
    keywords
  }, canonicalUrl)
  
  // 更新社交媒体类型
  setSocialTags(title, description, 'game')
}

/**
 * 重置为默认TDK
 */
export function resetToDefaultSEO() {
  setPageSEO(defaultSEO)
} 