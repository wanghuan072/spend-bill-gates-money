/**
 * 结构化数据工具 - 生成JSON-LD格式的Schema.org数据
 */

// 网站基础信息
const siteInfo = {
  name: 'Spend Bill Gates Money',
  url: 'https://spendgatesmoney.com',
  logo: '/images/logo.png',
  description: 'Interactive wealth simulation game where you can experience spending Bill Gates\' fortune.',
  sameAs: [
    'https://twitter.com/wealthgame',
    'https://facebook.com/wealthgame'
  ]
}

/**
 * 生成网站组织信息结构化数据
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteInfo.name,
    url: siteInfo.url,
    logo: siteInfo.logo,
    description: siteInfo.description,
    sameAs: siteInfo.sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${siteInfo.url}/contact`
    }
  }
}

/**
 * 生成网站结构化数据
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteInfo.name,
    url: siteInfo.url,
    description: siteInfo.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteInfo.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * 生成面包屑导航结构化数据
 * @param {Array} breadcrumbs - 面包屑数组，格式：[{name: 'Home', url: '/'}, {name: 'Games', url: '/games'}]
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  const itemListElement = breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteInfo.url}${item.url}`
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  }
}

/**
 * 生成游戏结构化数据 (SoftwareApplication)
 * @param {Object} game - 游戏对象
 */
export function generateGameSchema(game) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: game.title,
    description: game.description,
    image: game.imageUrl,
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Organization',
      name: siteInfo.name
    },
    publisher: {
      '@type': 'Organization',
      name: siteInfo.name,
      logo: {
        '@type': 'ImageObject',
        url: siteInfo.logo
      }
    },
    datePublished: game.date || new Date().toISOString(),
    dateModified: game.date || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteInfo.url}/games/${game.addressBar}`
    },
    genre: 'Simulation',
    platform: 'Web Browser',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      ratingCount: '1000'
    }
  }
}

/**
 * 生成产品结构化数据 (Product)
 * @param {Object} product - 产品对象
 */
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Luxury Brand'
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: siteInfo.name
      }
    },
    category: product.category || 'Luxury Item'
  }
}

/**
 * 生成FAQ结构化数据
 * @param {Array} faqs - FAQ数组，格式：[{question: 'Q', answer: 'A'}]
 */
export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * 生成游戏集合结构化数据 (ItemList)
 * @param {Array} games - 游戏数组
 * @param {string} listName - 列表名称
 */
export function generateGameListSchema(games, listName = 'Games Collection') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: `Collection of interactive games on ${siteInfo.name}`,
    numberOfItems: games.length,
    itemListElement: games.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: game.title,
        description: game.description,
        url: `${siteInfo.url}/games/${game.addressBar}`
      }
    }))
  }
}

/**
 * 在页面中插入结构化数据
 * @param {Object} schema - 结构化数据对象
 */
export function insertStructuredData(schema) {
  // 移除已存在的结构化数据
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => script.remove())
  
  // 创建新的结构化数据脚本
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema, null, 2)
  document.head.appendChild(script)
}

/**
 * 插入多个结构化数据
 * @param {Array} schemas - 结构化数据数组
 */
export function insertMultipleStructuredData(schemas) {
  schemas.forEach(schema => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)
  })
} 