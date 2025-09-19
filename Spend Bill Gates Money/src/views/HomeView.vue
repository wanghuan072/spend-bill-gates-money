<template>
  <main class="home-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 游戏头部区域 -->
    <section class="game-header" aria-labelledby="game-title" v-if="gameStore.currentCharacter">
      <div class="header-content">
        <div class="bill-gates-image">
          <img :src="gameStore.currentCharacter.image" :alt="`${gameStore.currentCharacter.name} profile picture`"
            class="profile-image" />
          <div class="image-glow" aria-hidden="true"></div>
        </div>
        <h1 id="game-title" class="game-title">{{ gameStore.currentCharacter.title }}</h1>
        <p class="game-subtitle">{{ gameStore.currentCharacter.subtitle }}</p>
      </div>
    </section>

    <!-- 余额显示区域 - 固定头部 -->
    <section class="balance-section" :class="{ fixed: isScrolled }" aria-labelledby="balance-title"
      v-if="gameStore.currentCharacter">
      <div class="balance-container">
        <div class="balance-main">
          <div class="balance-info">
            <h2 id="balance-title" class="balance-label">Current Balance</h2>
            <div class="balance-amount" role="text" aria-label="Current balance">
              {{ gameStore.formatCurrency(gameStore.balance) }}
            </div>
          </div>
          <div class="balance-stats" role="region" aria-label="Spending statistics">
            <div class="stat-item">
              <span class="stat-label">Spent</span>
              <span class="stat-value" role="text" aria-label="Percentage spent">
                {{ gameStore.spentPercentage }}%
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Remaining</span>
              <span class="stat-value" role="text" aria-label="Percentage remaining">
                {{ (100 - parseFloat(gameStore.spentPercentage)).toFixed(4) }}%
              </span>
            </div>
          </div>
          <div class="balance-controls">
            <button class="reset-btn-compact" @click="resetGame" aria-label="Reset game to initial state">
              <span class="reset-icon">⟲</span>
              <span class="reset-text">Reset</span>
            </button>
            <button class="view-receipt-btn" @click="toggleReceipt" aria-label="View purchase receipt">
              <span class="receipt-icon" aria-hidden="true">📄</span>
              <span class="receipt-text">Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- PC横幅广告1 -->
    <aside v-if="!isMobile" class="ad-container">
      <ins class="eas6a97888e2" data-zoneid="5726872"></ins>
    </aside>

    <!-- PC 粘性侧边横幅广告右侧 -->
    <aside v-if="!isMobile" class="ad-container">
      <ins class="eas6a97888e17" data-zoneid="5726882"></ins>
    </aside>

    <!-- PC 粘性侧边横幅广告左侧 -->
    <aside v-if="!isMobile" class="ad-container">
      <ins class="eas6a97888e17" data-zoneid="5726884"></ins>
    </aside>

    <!-- PC粘性底部横幅广告1 -->
    <aside v-if="!isMobile" class="ad-container">
      <ins class="eas6a97888e17" data-zoneid="5726920"></ins>
    </aside>

    <!-- 移动横幅广告1 -->
    <aside v-if="isMobile" class="ad-container">
      <ins class="eas6a97888e10" data-zoneid="5726906"></ins>
    </aside>

    <!-- 移动粘性底部横幅广告1 -->
    <aside v-if="isMobile" class="ad-container">
      <ins class="eas6a97888e14" data-zoneid="5726914"></ins> 
    </aside>

    <!-- 商品列表区域 -->
    <section class="products-section" aria-labelledby="products-title" v-if="gameStore.currentCharacter">
      <div class="products-container">
        <div class="section-header">
          <h2 id="products-title" class="section-title">Available Items</h2>
          <p class="section-subtitle">Choose from luxury items to philanthropic causes</p>
        </div>
        <div class="products-grid" role="list" aria-label="Available products">
          <ProductCard v-for="product in gameStore.currentProducts" :key="product.id" :product="product"
            role="listitem" />
        </div>
      </div>
    </section>

    <!-- PC横幅广告2 -->
    <aside v-if="!isMobile" class="ad-container">
      <ins class="eas6a97888e2" data-zoneid="5726874"></ins>
    </aside>

    <!-- 移动横幅广告2 -->
    <aside v-if="isMobile" class="ad-container">
      <ins class="eas6a97888e10" data-zoneid="5726910"></ins>
    </aside>

    <!-- 收据区域 -->
    <section class="receipt-section" v-if="gameStore.showReceipt" role="dialog" aria-labelledby="receipt-title"
      aria-modal="true">
      <div class="receipt-overlay" @click="closeReceipt" aria-hidden="true"></div>
      <div class="receipt-modal">
        <ReceiptTable :show-receipt="gameStore.showReceipt" @close="closeReceipt" />
      </div>
    </section>

    <!-- 角色详细信息 -->
    <section class="character-details-section"
      v-if="gameStore.currentCharacter && gameStore.currentCharacter.detailsHtml">
      <div class="character-details-container">
        <div class="v-html-content" v-html="gameStore.currentCharacter.detailsHtml"></div>
      </div>
    </section>


    <!-- PC横幅广告3 -->
    <aside v-if="!isMobile" class="ad-container">
      <ins class="eas6a97888e2" data-zoneid="5726876"></ins>
    </aside>

    <!-- 移动横幅广告3 -->
    <aside v-if="isMobile" class="ad-container">
      <ins class="eas6a97888e10" data-zoneid="5726912"></ins>
    </aside>


    <!-- 热门游戏区域 -->
    <HotGames @select="navigateToGame" />

    <!-- 原生广告-通用 -->
    <aside class="ad-container">
      <ins class="eas6a97888e20" data-zoneid="5726896"></ins>
    </aside>


    <!-- 钱花完弹窗 -->
    <MoneyExhaustedModal :show="gameStore.showMoneyExhaustedModal"
      :character-name="gameStore.currentCharacter?.name || 'Bill Gates'"
      :character-image="gameStore.currentCharacter?.image || '/images/bill-gates.webp'"
      :total-spent="gameStore.spentAmount" :total-items="gameStore.totalItemsPurchased"
      :format-currency="gameStore.formatCurrency" @close="handleCloseExhaustedModal"
      @restart="handleRestartFromExhausted" @view-receipt="handleViewReceiptFromModal" />

    <!-- 底部Footer -->
    <Footer />
  </main>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { availableCharacters, gameConfig } from '../data/config.js'
import Header from '../components/Header.vue'
import ProductCard from '../components/ProductCard.vue'
import ReceiptTable from '../components/ReceiptTable.vue'
import HotGames from '../components/HotGames.vue'
import Footer from '../components/Footer.vue'
import MoneyExhaustedModal from '../components/MoneyExhaustedModal.vue'
import { setPageSEO } from '../utils/seo.js'
import {
  insertStructuredData,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '../utils/structuredData.js'

import { useDeviceDetection } from '@/utils/useDeviceDetection.js'

const { isMobile } = useDeviceDetection()

const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
const isScrolled = ref(false)

// 从store获取状态和方法
const { toggleReceipt, resetGame } = gameStore

// 导航到游戏详情页
const navigateToGame = (addressBar) => {
  router.push(`/games/${addressBar}`)
}

// 关闭收据
const closeReceipt = () => {
  gameStore.showReceipt = false
}

// 处理钱花完弹窗事件
const handleCloseExhaustedModal = () => {
  gameStore.closeMoneyExhaustedModal()
}

const handleRestartFromExhausted = () => {
  gameStore.restartFromExhausted()
}

const handleViewReceiptFromModal = () => {
  gameStore.closeMoneyExhaustedModal()
  gameStore.toggleReceipt()
}

// 设置角色页面的SEO
const setCharacterPageSEO = () => {
  const currentCharacter = gameStore.currentCharacter

  // 检查 currentCharacter 是否存在
  if (!currentCharacter) {
    console.log('setCharacterPageSEO: currentCharacter is null, skipping SEO setup')
    return
  }

  // 如果是首页（Bill Gates），使用默认SEO
  if (route.path === '/') {
    if (currentCharacter.seo) {
      setPageSEO(currentCharacter.seo)
    }
  } else {
    // 其他角色页面，使用角色特定的SEO
    if (currentCharacter.seo) {
      setPageSEO(currentCharacter.seo)
    }
  }

  // 插入基础结构化数据
  const baseSchemas = [generateOrganizationSchema(), generateWebsiteSchema()]

  insertStructuredData(baseSchemas)
}

// 监听角色变化，更新SEO
watch(
  () => gameStore.currentCharacter,
  (newCharacter) => {
    if (newCharacter) {
      setCharacterPageSEO()
    }
  },
  { immediate: false }
)

// 监听滚动事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // 最简单的逻辑：当滚动超过300px时固定
  const shouldBeFixed = scrollTop > 300

  // console.log('Scroll:', scrollTop, 'Fixed:', shouldBeFixed)
  isScrolled.value = shouldBeFixed
}

// 广告配置列表
const adConfigs = [
  { selector: '.eas6a97888e2', delay: 0 },    // 头部广告
  { selector: '.eas6a97888e35', delay: 300 }, // 底部广告
  { selector: '.eas6a97888e36', delay: 600 }, // 中间广告
  // 可以继续添加更多广告位
  // { selector: '.eas6a97888e37', delay: 900 }, // 侧边广告
  // { selector: '.eas6a97888e38', delay: 1200 }, // 其他位置广告
]

// 延迟加载多个广告函数
const loadAdsWithDelay = (baseDelay = 1000) => {
  setTimeout(() => {
    if (window.AdProvider) {
      adConfigs.forEach((config, index) => {
        setTimeout(() => {
          const adElement = document.querySelector(config.selector)
          if (adElement) {
            console.log(`Loading ad: ${config.selector}`)
            window.AdProvider.push({ "serve": {} })
          }
        }, config.delay)
      })
    }
  }, baseDelay)
}

// 组件挂载时根据路由设置角色
onMounted(async () => {
  // 根据当前路由设置正确的角色
  const currentPath = route.path

  if (currentPath === '/') {
    // 首页，设置为 Bill Gates
    gameStore.switchCharacter('bill-gates')
  } else {
    // 其他路径，查找对应的角色
    const character = Object.values(gameStore.availableCharacters || {}).find(
      (c) => c.addressBar && `/${c.addressBar}` === currentPath
    )
    if (character) {
      gameStore.switchCharacter(character.id)
    }
  }

  // 等待响应式更新完成
  await nextTick()

  window.addEventListener('scroll', handleScroll)

  // 设置初始SEO
  setCharacterPageSEO()

  // 延迟加载所有广告
  loadAdsWithDelay(1000)
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.home-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

/* 游戏头部区域 */
.game-header {
  padding: 40px 0 30px 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.bill-gates-image {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.image-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
  border-radius: 50%;
  z-index: -1;
  opacity: 0.3;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }

  100% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.game-title {
  font-size: 38px;
  font-weight: 900;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: titleFloat 4s ease-in-out infinite;
}

@keyframes titleFloat {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-5px);
  }
}

.game-subtitle {
  font-size: 18px;
  color: #4a5568;
  margin: 0;
  font-weight: 500;
  opacity: 0.8;
}

/* 余额显示区域 */
.balance-section {
  position: relative;
  z-index: 100;
  padding: 0 24px 24px;
  transition: all 0.3s ease;
}

.balance-section.fixed {
  position: fixed;
  top: 0;
  /* 考虑Header高度 */
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 0 -24px;
  padding: 16px 24px;
}

.balance-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.balance-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.balance-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.balance-info {
  flex: 0 0 auto;
}

.balance-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.balance-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.balance-label {
  font-size: 14px;
  color: #718096;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.balance-amount {
  font-size: 28px;
  font-weight: 900;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}


.stat-item {
  text-align: center;
  background: rgba(160, 174, 192, 0.1);
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(160, 174, 192, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(160, 174, 192, 0.15);
  transform: translateY(-2px);
}

.stat-label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(160, 174, 192, 0.3);
}

.view-receipt-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.view-receipt-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.receipt-icon {
  font-size: 16px;
}

/* 商品列表区域 */
.products-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.products-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 30px;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-subtitle {
  font-size: 18px;
  color: #4a5568;
  margin: 0;
  font-weight: 500;
  opacity: 0.8;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 32px;
}

/* 收据区域 */
.receipt-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.receipt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.receipt-modal {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 900px;
}

/* 角色详细信息区域 */
.character-details-section {
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.character-details-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 重置游戏按钮 */
.reset-section {
  padding: 40px 24px;
  text-align: center;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  color: #2d3748;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 154, 158, 0.3);
}

.reset-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(255, 154, 158, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .game-header {
    padding: 40px 16px 30px;
  }

  .game-title {
    font-size: 36px;
  }

  .game-subtitle {
    font-size: 16px;
  }

  .balance-section {
    padding: 0 16px 20px;
  }

  .balance-container {
    padding: 20px;
  }

  .balance-amount {
    font-size: 28px;
  }

  .products-section {
    padding: 30px 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .section-subtitle {
    font-size: 16px;
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .character-details-section {
    padding: 30px 16px;
  }

  .character-details-container {
    padding: 24px;
  }

  .reset-section {
    padding: 30px 16px;
  }

  .receipt-section {
    padding: 16px;
  }

  .receipt-modal {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .game-header {
    padding: 30px 10px 20px;
  }

  .game-title {
    font-size: 24px;
  }

  .game-subtitle {
    font-size: 12px;
  }

  .profile-image {
    width: 80px;
    height: 80px;
  }

  .balance-section {
    padding: 0 10px 10px;
  }

  .balance-container {
    padding: 10px;
  }

  .balance-main {
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .balance-amount {
    font-size: 20px;
  }

  .balance-label {
    font-size: 12px;
  }

  .balance-stats {
    padding: 10px;
    gap: 10px;
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-value {
    font-size: 14px;
  }

  .view-receipt-btn {
    padding: 10px 16px;
    font-size: 12px;
  }

  .products-section {
    padding: 20px 10px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .section-subtitle {
    font-size: 12px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 20px;
  }

  .character-details-section {
    padding: 20px 10px;
  }

  .character-details-container {
    padding: 10px;
  }

  .reset-section {
    padding: 20px 10px;
  }

  .reset-btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .receipt-section {
    padding: 10px;
  }

  .receipt-modal {
    max-width: 100%;
  }
}

/* V-HTML 内容样式 - 使用深度选择器 */
.v-html-content:deep(h2) {
  font-size: 28px;
  font-weight: 800;
  margin: 32px 0 20px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.3;
}

.v-html-content:deep(h3) {
  font-size: 24px;
  font-weight: 700;
  margin: 28px 0 16px 0;
  color: #4a5568;
  position: relative;
  padding-left: 16px;
  line-height: 1.4;
}

.v-html-content:deep(h3::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

.v-html-content:deep(h4) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: #2d3748;
  line-height: 1.4;
}

.v-html-content:deep(h5) {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  color: #4a5568;
  line-height: 1.4;
}

.v-html-content:deep(p) {
  margin: 16px 0;
  line-height: 1.8;
  color: #2d3748;
  font-size: 16px;
}

.v-html-content:deep(ul) {
  margin: 20px 0;
  padding-left: 24px;
  color: #2d3748;
  list-style: none;
}

.v-html-content:deep(ul li) {
  position: relative;
  margin: 12px 0;
  padding-left: 20px;
  line-height: 1.7;
}

.v-html-content:deep(ul li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  transform: translateY(-50%);
}

.v-html-content:deep(ol) {
  margin: 20px 0;
  padding-left: 24px;
  color: #2d3748;
  counter-reset: ol-counter;
}

.v-html-content:deep(ol li) {
  position: relative;
  margin: 12px 0;
  padding-left: 32px;
  line-height: 1.7;
  counter-increment: ol-counter;
}

.v-html-content:deep(ol li::before) {
  content: counter(ol-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.v-html-content:deep(strong) {
  font-weight: 700;
  color: #1a202c;
}

.v-html-content:deep(em) {
  font-style: italic;
  color: #4a5568;
}

.v-html-content:deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-html-content:deep(img:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.v-html-content:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.v-html-content:deep(th),
.v-html-content:deep(td) {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-html-content:deep(th) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.v-html-content:deep(a) {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.v-html-content:deep(a:hover) {
  color: #764ba2;
  border-bottom-color: #764ba2;
}

/* 广告容器样式 */
.ad-container {
  max-width: 100%;
  padding: 10px 0;
  text-align: center;
}

.ad-container ins {
  display: inline-block;
  max-width: 100%;
}

/* 紧凑重置按钮样式 */
.reset-btn-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}

.view-receipt-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.reset-btn-compact:hover {
  background: linear-gradient(135deg, #ff5252, #e53e3e);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.view-receipt-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.reset-btn-compact:active,
.view-receipt-btn:active {
  transform: translateY(0);
}

.reset-btn-compact:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.reset-icon {
  font-size: 16px;
  display: inline-block;
  animation: rotate 2s linear infinite paused;
}

.reset-btn-compact:hover .reset-icon {
  animation-play-state: running;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.reset-text {
  font-size: 14px;
  font-weight: 600;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .balance-main {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  
  .balance-stats {
    gap: 15px;
  }
  
  .balance-controls {
    gap: 10px;
  }
  
  .reset-btn-compact,
  .view-receipt-btn {
    padding: 8px 12px;
    font-size: 12px;
    gap: 5px;
  }
  
  .reset-icon,
  .receipt-icon {
    font-size: 14px;
  }
  
  .reset-text,
  .receipt-text {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .balance-main {
    gap: 15px;
  }
  
  .balance-stats {
    gap: 12px;
  }
  
  .stat-item {
    padding: 6px 12px;
  }
  
  .reset-btn-compact,
  .view-receipt-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .reset-icon,
  .receipt-icon {
    font-size: 13px;
  }
}

</style>