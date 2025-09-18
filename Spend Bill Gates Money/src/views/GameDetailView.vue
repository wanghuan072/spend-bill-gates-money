<template>
  <div class="game-detail-wrapper">
    <!-- 头部组件 -->
    <Header />

    <!-- 加载态 -->
    <div v-if="loading" class="loading">Loading game...</div>

    <!-- 未找到 -->
    <div v-else-if="!game" class="not-found">
      <h2>Game Not Found</h2>
      <button @click="goBack" class="back-btn">Back to Games</button>
    </div>

    <!-- 详情主体 -->
    <div v-else class="layout">
      <!-- 左列：主内容 -->
      <section class="main" :class="{ 'page-fullscreen': isPageFullscreen }">
        <div class="player">
          <!-- 预览蒙版（点击后显示 iframe） -->
          <div v-if="!showGameplay" class="preview" @click="toggleGameplay">
            <div class="preview-bg" :style="{ backgroundImage: `url(${game.imageUrl})` }">
              <div class="preview-overlay">
                <div class="icon">
                  <img :src="game.imageUrl" :alt="game.imageAlt || game.title" />
                </div>
                <button class="play">PLAY</button>
              </div>
            </div>
          </div>

          <!-- 游戏 iframe -->
          <div v-else class="iframe-wrap">
            <iframe ref="gameIframe" :src="game.iframeUrl" title="game" frameborder="0" allowfullscreen
              @load="onIframeLoad"></iframe>
          </div>
        </div>

        <!-- 操作栏：左标题，右侧全屏/网页全屏按钮 -->
        <div class="controls">
          <h1 class="title">{{ game.title }}</h1>
          <div class="actions">
            <button class="btn" :disabled="!showGameplay" @click="toggleFullscreen" title="Fullscreen"
              aria-label="Fullscreen">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            <button class="btn" :disabled="!showGameplay" @click="togglePageFullscreen" title="Page Fullscreen"
              aria-label="Page Fullscreen">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- About 内容（v-html 渲染） -->
        <article class="about" v-html="game.detailsHtml"></article>
      </section>

      <!-- 右列：评分/评论 -->
      <aside class="sidebar" v-if="!isPageFullscreen">
         <!-- 热门游戏推荐 -->
         <div class="panel">
          <HotGames v-if="game" :exclude-address-bar="game.addressBar" @select="navigateToGame"
            class="sidebar-hot-games" />
        </div>

        <!-- 评分概览（展示区域） -->
        <div class="panel">
          <h3 class="panel-title">Rating Overview</h3>
          <div v-if="commentStore.loading" class="loading-text">Loading...</div>
          <div v-else-if="ratingsData.count > 0" class="summary-row">
            <div class="summary-score">{{ Number(averageRating).toFixed(1) }}</div>
            <div class="summary-stars" aria-label="average rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(averageRating) }">★</span>
            </div>
            <div class="summary-count">{{ ratingsData.count }} ratings</div>
          </div>
          <div v-else class="no-ratings">
            <p class="muted small">No rating data available</p>
          </div>

          <!-- 评分分布 -->
          <div v-if="!commentStore.loading && ratingsData.count > 0" class="rating-distribution">
            <div v-for="n in 5" :key="n" class="rating-bar">
              <span class="rating-label">{{ n }}★</span>
              <div class="bar-container">
                <div class="bar" :style="{ width: getRatingPercentage(n) + '%' }"></div>
              </div>
              <span class="rating-count">{{ getRatingCount(n) }}</span>
            </div>
          </div>
        </div>

        <!-- 写评论（提交区域） -->
        <div class="panel">
          <h3 class="panel-title">Write Your Review</h3>

          <div class="field">
            <label class="label">Nickname <span class="req">*</span></label>
            <input class="input" type="text" v-model="form.nickname" placeholder="Enter your nickname" />
          </div>
          <div class="field">
            <label class="label">Rating <span class="req">*</span></label>
            <div class="stars-input" role="img" aria-label="select rating">
              <span v-for="n in 5" :key="n" class="star" :class="{
                filled: n <= form.rating,
                hover: n <= hoverRating && hoverRating > 0
              }" @click="selectRating(n)" @mouseenter="hoverRating = n" @mouseleave="hoverRating = 0">{{ n <=
                  (hoverRating || form.rating) ? '★' : '☆' }}</span>
            </div>
            <div v-if="form.rating > 0" class="rating-selected">
              Selected {{ form.rating }} star rating
            </div>
          </div>
          <div class="field">
            <label class="label">Comment <span class="req">*</span></label>
            <textarea class="textarea" rows="4" v-model="form.comment" maxlength="1000"
              placeholder="Share your thoughts about this game..."></textarea>
            <div class="hint">{{ form.comment.length }}/1000</div>
          </div>
          <button class="btn wide" @click="submitReview"
            :disabled="commentStore.submitting || !form.nickname || !form.comment || !form.rating">
            {{ commentStore.submitting ? 'Submitting...' : 'Submit Review' }}
          </button>
          <p class="muted small">Connected to real API system, data will be saved to database.</p>
        </div>

        <!-- 评论列表 -->
        <div class="panel">
          <h3 class="panel-title">All Reviews ({{ commentsData.length }})</h3>
          <div v-if="commentStore.loading" class="loading-text">Loading...</div>
          <div v-else-if="commentsData.length === 0" class="no-reviews">
            No reviews yet, be the first to review!
          </div>
          <ul v-else class="reviews">
            <li v-for="r in commentsData" :key="r.id" class="review-item">
              <div class="review-head">
                <span class="review-name">{{ r.name }}</span>
                <span class="review-date">{{ formatDate(r.timestamp) }}</span>
              </div>
              <div v-if="r.rating" class="review-rating">
                <span class="review-rating-label">Rating:</span>
                <div class="review-stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= r.rating }">★</span>
                </div>
              </div>
              <p class="review-text">{{ r.text }}</p>
            </li>
          </ul>
        </div>

       
      </aside>
    </div>

    <!-- 底部Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import HotGames from '../components/HotGames.vue'
import Footer from '../components/Footer.vue'
import { games } from '../data/games.js'
import { useCommentStore } from '../stores/commentStore'
import { setGameDetailPageSEO } from '../utils/seo.js'
import { insertStructuredData, generateGameSchema } from '../utils/structuredData.js'

const route = useRoute()
const router = useRouter()
const commentStore = useCommentStore()

const loading = ref(true)
const showGameplay = ref(false)
const isPageFullscreen = ref(false)
const gameIframe = ref(null)
const iframeLoaded = ref(false)

// 根据 addressBar 查找游戏
const game = computed(() => games.find((g) => g.addressBar === route.params.addressBar))

// 评论和评分数据
const commentsData = computed(() => commentStore.getComments(game.value?.addressBar || ''))
const ratingsData = computed(() => commentStore.getRatings(game.value?.addressBar || ''))

// 表单状态
const form = ref({ nickname: '', rating: 0, comment: '' })
const hoverRating = ref(0)

// 提交限制
const lastSubmitTime = ref(null)
const remainingTime = ref(0)
const canSubmit = ref(true)

// 计算平均评分
const averageRating = computed(() => {
  const avg = ratingsData.value.average
  return typeof avg === 'number' ? avg : 0
})

// 获取评分数量
function getRatingCount(rating) {
  return ratingsData.value.ratings?.[String(rating)] || 0
}

// 获取评分百分比
function getRatingPercentage(rating) {
  const count = getRatingCount(rating)
  const total = ratingsData.value.count || 1
  return Math.round((count / total) * 100)
}

// 检查是否可以提交
function checkCanSubmit() {
  if (!lastSubmitTime.value) {
    canSubmit.value = true
    return
  }

  const now = Date.now()
  const timeDiff = now - lastSubmitTime.value
  const oneMinute = 60 * 1000

  if (timeDiff >= oneMinute) {
    canSubmit.value = true
    remainingTime.value = 0
  } else {
    canSubmit.value = false
    remainingTime.value = Math.ceil((oneMinute - timeDiff) / 1000)
  }
}

// 定时器更新剩余时间
let timer = null
function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    checkCanSubmit()
    if (canSubmit.value) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

// 加载评论和评分数据
const loadData = async () => {
  if (!game.value) return

  try {
    await commentStore.loadData(game.value.addressBar)
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 提交评论和评分
async function submitReview() {
  if (!form.value.nickname || !form.value.comment || !form.value.rating || commentStore.submitting) return

  // 检查时间限制
  if (!canSubmit.value) {
    alert(`⏰ You can only submit once per minute. Please wait ${remainingTime.value} seconds before trying again.`)
    return
  }

  try {
    await commentStore.submitComment(game.value.addressBar, {
      name: form.value.nickname,
      text: form.value.comment,
      rating: form.value.rating
    })

    // 设置提交时间限制
    lastSubmitTime.value = Date.now()
    checkCanSubmit()
    startTimer()

    // 清空表单
    form.value = { nickname: '', rating: 0, comment: '' }
    hoverRating.value = 0

    alert('Review and rating submitted successfully!')
  } catch (error) {
    alert('Submission failed: ' + error.message)
  }
}

// 选择评分
function selectRating(n) {
  form.value.rating = n
}

// 日期格式化
function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    return dateString
  }
}

// iframe加载完成回调
function onIframeLoad() {
  iframeLoaded.value = true
}

function toggleGameplay() {
  showGameplay.value = !showGameplay.value
  if (!showGameplay.value && isPageFullscreen.value) {
    exitPageFullscreen()
  }
}

// 浏览器全屏（iframe 元素）
function toggleFullscreen() {
  if (!gameIframe.value) return
  if (!document.fullscreenElement) {
    gameIframe.value.requestFullscreen?.().catch(() => { })
  } else {
    document.exitFullscreen?.()
  }
}

// 网页全屏（铺满视口）
function togglePageFullscreen() {
  if (isPageFullscreen.value) {
    exitPageFullscreen()
  } else {
    // 如果游戏还没开始，先启动游戏
    if (!showGameplay.value) {
      showGameplay.value = true
      // 等待iframe开始加载后再全屏
      setTimeout(() => {
        if (gameIframe.value) {
          enterPageFullscreen()
        }
      }, 100)
    } else {
      enterPageFullscreen()
    }
  }
}

function enterPageFullscreen() {
  isPageFullscreen.value = true
  document.body.style.overflow = 'hidden'
}

function exitPageFullscreen() {
  isPageFullscreen.value = false
  document.body.style.overflow = 'auto'
}

const navigateToGame = (addressBar) => {
  router.push(`/games/${addressBar}`)
}

const goBack = () => {
  router.push('/games')
}

// 监听游戏变化，设置SEO和加载数据
watch(
  game,
  async (newGame) => {
    if (newGame) {
      // 设置游戏详情页SEO
      setGameDetailPageSEO(newGame)
      // 插入游戏结构化数据
      const gameSchema = generateGameSchema(newGame)
      insertStructuredData(gameSchema)
      // 加载评论数据
      await loadData()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  // 模拟轻量加载
  setTimeout(() => (loading.value = false), 200)

  // 加载评论和评分数据
  await loadData()

  // 检查提交限制
  checkCanSubmit()
})

onUnmounted(() => {
  if (isPageFullscreen.value) exitPageFullscreen()

  // 清理定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
/* Game-Comment 原始样式 */
.game-detail-wrapper {
  width: 100%;
  background: #f8f9fa;
  min-height: 100vh;
}

.loading,
.not-found {
  padding: 24px;
  text-align: center;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左列 */
.main {
  background: #f3f4f6;
  /* 全局淡灰色背景 */
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
}

.player {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
  /* 与整体一致的淡灰底 */
}

.preview {
  aspect-ratio: 16 / 9;
}

.preview-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  backdrop-filter: blur(6px);
}

.icon img {
  width: 96px;
  height: 96px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.play {
  background: #e5e7eb;
  /* 淡灰背景 */
  color: #333;
  /* 深灰文字 */
  border: 1px solid #d1d5db;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.iframe-wrap {
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  /* 淡灰背景 */
}

.iframe-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  object-fit: contain;
}

.controls {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #f3f4f6;
  /* 浅灰色背景 */
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.controls .title {
  margin: 0;
  /* 重置H1默认margin */
  font-size: 16px;
  /* 设置合适的字体大小 */
  font-weight: 600;
  color: #333;
  /* 字体深灰 */
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  /* 更接近淡灰 */
  color: #333;
  border-radius: 8px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.about {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  /* 内容区浅灰 */
  color: #333;
  /* 文字颜色 */
  line-height: 1.7;
}

/* 网页全屏 */
.main.page-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  background: #000 !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
}

.main.page-fullscreen .player {
  width: 100% !important;
  height: 100% !important;
  background: #000 !important;
  border: none !important;
  border-radius: 0 !important;
}

.main.page-fullscreen .iframe-wrap {
  width: 100% !important;
  height: calc(100% - 60px) !important;
  background: #000 !important;
  aspect-ratio: unset !important;
}

.main.page-fullscreen .iframe-wrap iframe {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  background: #000 !important;
}

.main.page-fullscreen .controls {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 60px !important;
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  border: none !important;
  z-index: 10000 !important;
}

.main.page-fullscreen .controls .title {
  color: white !important;
}

.main.page-fullscreen .btn {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.main.page-fullscreen .about {
  display: none !important;
}

/* 右列 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel {
  background: #f3f4f6;
  /* 侧栏统一浅灰 */
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  color: #333;
}

.panel-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-score {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.summary-count {
  font-size: 12px;
  color: #666;
}

.summary-stars .star,
.review-stars .star,
.stars-input .star {
  color: #d1d5db;
  /* 默认灰色 */
  transition: color 0.2s;
}

.summary-stars .star.filled,
.review-stars .star.filled,
.stars-input .star.filled {
  color: #f59e0b;
  /* 实心星（琥珀色） */
}

.stars-input .star.hover {
  color: #fbbf24;
  /* hover时浅橙色 */
}

.stars-input .star {
  cursor: pointer;
  margin-right: 4px;
}

.field {
  margin-bottom: 10px;
}

.label {
  display: block;
  font-size: 12px;
  color: #333;
  margin-bottom: 6px;
}

.req {
  color: #ef4444;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  background: #f9fafb;
  color: #333;
  box-sizing: border-box;
}

.hint {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.btn.wide {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  background: #e5e7eb;
  color: #333;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-text {
  text-align: center;
  color: #666;
  padding: 10px;
  font-size: 14px;
}

.no-reviews,
.no-ratings {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
}

.reviews {
  display: grid;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.review-item {
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
  margin-top: 10px;
}

.review-head {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.review-name {
  color: #333;
  font-weight: 600;
}

.review-date {
  color: #666;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  font-size: 12px;
}

.review-rating-label {
  color: #666;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.review-text {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.muted {
  color: #666;
  /* 次要文字 */
}

.small {
  font-size: 12px;
}

/* 评分分布样式 */
.rating-distribution {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}

.rating-label {
  width: 30px;
  color: #666;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #f59e0b;
  transition: width 0.3s ease;
}

.rating-count {
  width: 20px;
  text-align: right;
  color: #666;
}

/* 评分选择提示 */
.rating-selected {
  margin-top: 6px;
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

.back-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
}

/* Sidebar中的HotGames样式 */
.sidebar-hot-games {
  margin-top: 0;
  /* 移除默认的上边距 */
  padding: 0;
}

.sidebar-hot-games :deep(.hot-games-container) {
  padding: 0;
  /* 移除默认padding */
}

.sidebar-hot-games :deep(.hot-games-header) {
  margin-bottom: 12px;
  /* 减少标题下方间距 */
}

.sidebar-hot-games :deep(.hot-games-title) {
  font-size: 20px;
  /* 增大标题字体 */
  font-weight: bold;
  /* 增加字体粗细 */
  margin: 0 0 6px 0;
  color: #333;
}

.sidebar-hot-games :deep(.hot-games-subtitle) {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.sidebar-hot-games :deep(.hot-games-grid) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 一行显示两个 */
  gap: 10px;
  /* 减少间距以适应sidebar */
  margin-top: 10px;
}

.sidebar-hot-games :deep(.hot-game-item) {
  border-radius: 6px;
  /* 稍微减少圆角 */
}

.sidebar-hot-games :deep(.hot-game-title) {
  font-size: 12px;
  /* 减少字体大小 */
  padding: 8px;
  /* 减少内边距 */
  line-height: 1.3;
}

/* 自适应 */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  /* 移动端时HotGames移回底部 */
  .sidebar .panel:has(.sidebar-hot-games) {
    order: 999;
    /* 确保在移动端时显示在最后 */
  }

  .preview {
    aspect-ratio: 1 / 2;
  }

  .iframe-wrap {
    aspect-ratio: 1 / 2;
  }
}

/* V-HTML 内容样式 - 使用深度选择器 */
.about:deep(h2) {
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

.about:deep(h3) {
  font-size: 24px;
  font-weight: 700;
  margin: 28px 0 16px 0;
  color: #4a5568;
  position: relative;
  padding-left: 16px;
  line-height: 1.4;
}

.about:deep(h3::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

.about:deep(h4) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: #2d3748;
  line-height: 1.4;
}

.about:deep(h5) {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  color: #4a5568;
  line-height: 1.4;
}

.about:deep(p) {
  margin: 16px 0;
  line-height: 1.8;
  color: #2d3748;
  font-size: 16px;
}

.about:deep(ul) {
  margin: 20px 0;
  padding-left: 24px;
  color: #2d3748;
  list-style: none;
}

.about:deep(ul li) {
  position: relative;
  margin: 12px 0;
  padding-left: 20px;
  line-height: 1.7;
}

.about:deep(ul li::before) {
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

.about:deep(ol) {
  margin: 20px 0;
  padding-left: 24px;
  color: #2d3748;
  counter-reset: ol-counter;
}

.about:deep(ol li) {
  position: relative;
  margin: 12px 0;
  padding-left: 32px;
  line-height: 1.7;
  counter-increment: ol-counter;
}

.about:deep(ol li::before) {
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

.about:deep(strong) {
  font-weight: 700;
  color: #1a202c;
}

.about:deep(em) {
  font-style: italic;
  color: #4a5568;
}

.about:deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about:deep(img:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.about:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.about:deep(th),
.about:deep(td) {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.about:deep(th) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.about:deep(a) {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.about:deep(a:hover) {
  color: #764ba2;
  border-bottom-color: #764ba2;
}
</style>