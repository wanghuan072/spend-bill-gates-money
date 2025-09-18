<template>
  <div class="admin-dashboard">
    <!-- 顶部：管理员信息和项目信息 -->
    <div class="admin-header">
      <div class="admin-info">
        <h1>管理后台</h1>
        <div class="admin-details">
          <span class="admin-name">欢迎，{{ commentStore.adminUser?.username }}</span>
          <span class="project-info">项目：{{ commentStore.adminUser?.project_id }}</span>
        </div>
      </div>
      <div class="admin-actions">
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </div>

    <!-- 主体内容：左右布局 -->
    <div class="admin-content">
      <!-- 左侧菜单 -->
      <div class="admin-sidebar">
        <nav class="admin-menu">
          <div class="menu-item active">
            <span class="menu-icon">💬</span>
            <span class="menu-text">评论管理</span>
          </div>
        </nav>
      </div>

      <!-- 右侧内容区域 -->
      <div class="admin-main">
        <div class="content-header">
          <h2>游戏评论与评分</h2>
          <div class="stats-summary">
            <div class="stat-item">
              <span class="stat-number">{{ totalGames }}</span>
              <span class="stat-label">游戏</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalReviews }}</span>
              <span class="stat-label">评论</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalRatings }}</span>
              <span class="stat-label">评分</span>
            </div>
          </div>
        </div>

        <!-- 游戏列表 -->
        <div v-if="commentStore.loading" class="loading">正在加载数据...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="games-list">
          <div v-if="Object.keys(commentStore.adminData).length === 0" class="no-data">
            <p>暂无游戏数据。</p>
          </div>
          
          <div v-for="(data, pageId) in commentStore.adminData" :key="pageId" class="game-card">
            <div class="game-header">
              <div class="game-info">
                <h3 class="game-title">{{ getGameTitle(pageId) }}</h3>
                <div class="game-stats">
                  <span class="rating-avg">平均：{{ calculateAverage(data.ratings) }}</span>
                  <span class="rating-count">{{ calculateTotal(data.ratings) }} 评分</span>
                  <span class="comment-count">{{ data.comments.length }} 评论</span>
                </div>
              </div>
              <button @click="openAddModal(pageId)" class="add-review-btn">
                + 添加评论
              </button>
            </div>

            <!-- 评论评分子列表 -->
            <div class="reviews-list">
              <div v-if="data.comments.length === 0" class="no-reviews">
                暂无评论
              </div>
              <div v-else>
                <div v-for="comment in data.comments" :key="comment.id" class="review-item">
                  <div class="review-content">
                    <div class="review-header">
                      <span class="reviewer-name">{{ comment.name }}</span>
                      <span class="review-time">{{ formatTime(comment.timestamp) }}</span>
                    </div>
                    <div v-if="comment.rating" class="review-rating">
                      <div class="rating-stars">
                        <span
                          v-for="n in 5"
                          :key="n"
                          class="star"
                          :class="{ filled: n <= comment.rating }"
                        >★</span>
                      </div>
                      <span class="rating-value">{{ comment.rating }}/5</span>
                    </div>
                    <div class="review-text">{{ comment.text }}</div>
                  </div>
                  <div class="review-actions">
                    <button @click="openEditModal(pageId, comment)" class="edit-btn">
                      编辑
                    </button>
                    <button @click="deleteReview(pageId, comment.id)" class="delete-btn">
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑评论弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑评论' : '添加评论' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>游戏：{{ getGameTitle(currentPageId) }}</label>
          </div>
          
          <div class="form-group">
            <label for="reviewer-name">姓名 *</label>
            <input
              id="reviewer-name"
              v-model="modalForm.name"
              type="text"
              placeholder="请输入评论者姓名"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="review-rating">评分 *</label>
            <div class="rating-input">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ filled: n <= modalForm.rating }"
                @click="modalForm.rating = n"
              >{{ n <= modalForm.rating ? '★' : '☆' }}</span>
            </div>
            <span class="rating-selected">{{ modalForm.rating }}/5 星</span>
          </div>
          
          <div class="form-group">
            <label for="review-text">评论内容 *</label>
            <textarea
              id="review-text"
              v-model="modalForm.text"
              rows="4"
              placeholder="请输入评论内容"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="review-time">评论时间</label>
            <input
              id="review-time"
              v-model="modalForm.timestamp"
              type="datetime-local"
              :placeholder="getCurrentDateTime()"
            />
            <small class="form-hint">不选择则使用当前时间</small>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">取消</button>
          <button @click="saveReview" class="save-btn" :disabled="!isFormValid">
            {{ isEditing ? '更新' : '添加' }}评论
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCommentStore } from '../stores/commentStore'
import { games } from '../data/games.js'

const router = useRouter()
const commentStore = useCommentStore()

// 响应式数据
const error = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const currentPageId = ref('')
const currentCommentId = ref(null)

// 模态框表单数据
const modalForm = ref({
  name: '',
  rating: 0,
  text: '',
  timestamp: ''
})

// 管理员信息
const adminInfo = computed(() => ({
  username: commentStore.adminUser?.username || 'admin',
  project: commentStore.adminUser?.project_id || 'spend_money'
}))

// 统计数据
const totalGames = computed(() => Object.keys(commentStore.adminData).length)

const totalReviews = computed(() => {
  return Object.values(commentStore.adminData).reduce((total, data) => {
    return total + (data.comments?.length || 0)
  }, 0)
})

const totalRatings = computed(() => {
  return Object.values(commentStore.adminData).reduce((total, data) => {
    if (!data.ratings) return total
    return total + Object.values(data.ratings).reduce((sum, count) => sum + count, 0)
  }, 0)
})

// 表单验证
const isFormValid = computed(() => {
  return modalForm.value.name.trim() && 
         modalForm.value.rating > 0 && 
         modalForm.value.text.trim()
})

// 工具方法
const getGameTitle = (pageId) => {
  const game = games.find(g => g.addressBar === pageId)
  return game?.title || pageId
}

const calculateAverage = (ratings) => {
  if (!ratings) return '0.0'
  
  let total = 0
  let count = 0
  
  Object.entries(ratings).forEach(([rating, ratingCount]) => {
    total += parseInt(rating) * ratingCount
    count += ratingCount
  })
  
  return count > 0 ? (total / count).toFixed(1) : '0.0'
}

const calculateTotal = (ratings) => {
  if (!ratings) return 0
  return Object.values(ratings).reduce((sum, count) => sum + count, 0)
}

const formatTime = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return timestamp
  }
}

const getCurrentDateTime = () => {
  return new Date().toISOString().slice(0, 16)
}

// 模态框操作
const openAddModal = (pageId) => {
  currentPageId.value = pageId
  isEditing.value = false
  modalForm.value = {
    name: '',
    rating: 0,
    text: '',
    timestamp: ''
  }
  showModal.value = true
}

const openEditModal = (pageId, comment) => {
  currentPageId.value = pageId
  currentCommentId.value = comment.id
  isEditing.value = true
  modalForm.value = {
    name: comment.name,
    rating: comment.rating || 0,
    text: comment.text,
    timestamp: comment.timestamp ? new Date(comment.timestamp).toISOString().slice(0, 16) : ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  currentPageId.value = ''
  currentCommentId.value = null
}

const saveReview = async () => {
  if (!isFormValid.value) return

  try {
    const reviewData = {
      pageId: currentPageId.value,
      name: modalForm.value.name.trim(),
      text: modalForm.value.text.trim(),
      rating: modalForm.value.rating,
      timestamp: modalForm.value.timestamp || null
    }

    if (isEditing.value) {
      await commentStore.updateFeedback(
        currentPageId.value,
        currentCommentId.value,
        reviewData
      )
    } else {
      await commentStore.addManualFeedback(reviewData)
    }

    closeModal()
  } catch (err) {
    alert('保存失败: ' + err.message)
  }
}

const deleteReview = async (pageId, commentId) => {
  if (!confirm('确定要删除这条评论吗？')) return

  try {
    await commentStore.deleteFeedback(pageId, commentId)
  } catch (err) {
    alert('删除失败: ' + err.message)
  }
}

const logout = () => {
  commentStore.adminLogout()
  router.push('/admin/login')
}

// 生命周期
onMounted(async () => {
  if (!commentStore.isAdmin) {
    router.push('/admin/login')
    return
  }
  
  try {
    await commentStore.loadAdminData()
  } catch (err) {
    error.value = err.message || '加载数据失败'
  }
})
</script>

<style scoped>
/* Game-Comment 原始样式 */
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.admin-info h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.admin-details {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #c82333;
}

.admin-content {
  display: flex;
  min-height: calc(100vh - 80px);
}

.admin-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 1rem 0;
}

.admin-menu {
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item.active {
  background: #e3f2fd;
  border-right: 3px solid #2196f3;
  color: #1976d2;
}

.menu-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h2 {
  margin: 0 0 1rem 0;
  color: #333;
}

.stats-summary {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #2196f3;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.game-title {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.game-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.add-review-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.add-review-btn:hover {
  background: #218838;
}

.reviews-list {
  padding: 1.5rem;
}

.no-reviews {
  text-align: center;
  color: #666;
  font-style: italic;
}

.review-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 1rem;
  background: #f8f9fa;
}

.review-content {
  flex: 1;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.reviewer-name {
  font-weight: bold;
  color: #333;
}

.review-time {
  color: #666;
  font-size: 0.85rem;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.rating-stars .star {
  color: #ddd;
}

.rating-stars .star.filled {
  color: #ffc107;
}

.rating-value {
  font-size: 0.85rem;
  color: #666;
}

.review-text {
  color: #333;
  line-height: 1.5;
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1rem;
}

.edit-btn, .delete-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.rating-input {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.rating-input .star {
  font-size: 1.5rem;
  cursor: pointer;
  color: #ddd;
}

.rating-input .star.filled {
  color: #ffc107;
}

.rating-selected {
  color: #666;
  font-size: 0.9rem;
}

.form-hint {
  display: block;
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.cancel-btn, .save-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #545b62;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #218838;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-content {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
  }
  
  .admin-main {
    padding: 1rem;
  }
  
  .stats-summary {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .game-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .review-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .review-actions {
    flex-direction: row;
    margin-left: 0;
  }
}
</style>