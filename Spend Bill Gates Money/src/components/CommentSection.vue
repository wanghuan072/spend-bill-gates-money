<template>
  <div class="comment-section">
    <!-- 评分概览 -->
    <div class="rating-overview">
      <h3 class="section-title">用户评分</h3>
      <div v-if="commentStore.loading" class="loading-text">加载中...</div>
      <div v-else class="rating-summary">
        <div class="rating-score">
          <div class="score-number">{{ Number(ratingsData.average || 0).toFixed(1) }}</div>
          <div class="score-stars">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= Math.round(ratingsData.average || 0) }"
            >★</span>
          </div>
          <div class="score-count">{{ ratingsData.count || 0 }} 个评分</div>
        </div>
        
        <!-- 评分分布 -->
        <div v-if="ratingsData.count > 0" class="rating-distribution">
          <div v-for="n in 5" :key="n" class="rating-bar">
            <span class="rating-label">{{ n }}★</span>
            <div class="bar-container">
              <div 
                class="bar" 
                :style="{ width: getRatingPercentage(n) + '%' }"
              ></div>
            </div>
            <span class="rating-count">{{ getRatingCount(n) }}</span>
          </div>
        </div>
        <div v-else class="no-ratings">
          <p class="muted">暂无评分数据</p>
        </div>
      </div>
    </div>

    <!-- 写评论 -->
    <div class="write-comment">
      <h3 class="section-title">写评论</h3>
      
      <div class="comment-form">
        <div class="form-field">
          <label class="field-label">昵称 <span class="required">*</span></label>
          <input
            class="form-input"
            type="text"
            v-model="form.nickname"
            placeholder="请输入您的昵称"
            maxlength="50"
          />
        </div>
        
        <div class="form-field">
          <label class="field-label">评分 <span class="required">*</span></label>
          <div class="rating-input">
            <span
              v-for="n in 5"
              :key="n"
              class="rating-star"
              :class="{ 
                filled: n <= form.rating,
                hover: n <= hoverRating && hoverRating > 0
              }"
              @click="selectRating(n)"
              @mouseenter="hoverRating = n"
              @mouseleave="hoverRating = 0"
            >{{ n <= (hoverRating || form.rating) ? '★' : '☆' }}</span>
          </div>
          <div v-if="form.rating > 0" class="rating-selected">
            已选择 {{ form.rating }} 星评分
          </div>
        </div>
        
        <div class="form-field">
          <label class="field-label">评论内容 <span class="required">*</span></label>
          <textarea
            class="form-textarea"
            rows="4"
            v-model="form.comment"
            maxlength="500"
            placeholder="分享您对这个游戏的看法..."
          ></textarea>
          <div class="char-count">{{ form.comment.length }}/500</div>
        </div>
        
        <button 
          class="submit-btn" 
          @click="submitComment" 
          :disabled="!canSubmit || commentStore.submitting"
        >
          {{ commentStore.submitting ? '提交中...' : '提交评论' }}
        </button>
        
        <div v-if="!commentStore.canSubmit" class="cooldown-notice">
          ⏰ 请等待 {{ commentStore.remainingCooldown }} 秒后再次提交
        </div>
        
        <p class="form-notice">评论将实时保存到数据库</p>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <h3 class="section-title">全部评论 ({{ commentsData.length }})</h3>
      
      <div v-if="commentStore.loading" class="loading-text">加载中...</div>
      <div v-else-if="commentsData.length === 0" class="no-comments">
        还没有评论，快来抢沙发吧！
      </div>
      <div v-else class="comments">
        <div v-for="comment in commentsData" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ comment.name }}</span>
            <span class="comment-date">{{ formatDate(comment.timestamp) }}</span>
          </div>
          
          <div v-if="comment.rating" class="comment-rating">
            <span class="rating-label">评分:</span>
            <div class="rating-stars">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ filled: n <= comment.rating }"
              >★</span>
            </div>
          </div>
          
          <p class="comment-text">{{ comment.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCommentStore } from '../stores/commentStore'

const props = defineProps({
  gameId: {
    type: String,
    required: true
  }
})

const commentStore = useCommentStore()

// 表单状态
const form = ref({
  nickname: '',
  rating: 0,
  comment: ''
})
const hoverRating = ref(0)

// 计算属性
const commentsData = computed(() => commentStore.getComments(props.gameId))
const ratingsData = computed(() => commentStore.getRatings(props.gameId))

const canSubmit = computed(() => {
  return form.value.nickname.trim() && 
         form.value.comment.trim() && 
         form.value.rating > 0 && 
         commentStore.canSubmit &&
         !commentStore.submitting
})

// 获取评分数量
const getRatingCount = (rating) => {
  return ratingsData.value.ratings?.[String(rating)] || 0
}

// 获取评分百分比
const getRatingPercentage = (rating) => {
  const count = getRatingCount(rating)
  const total = ratingsData.value.count || 1
  return Math.round((count / total) * 100)
}

// 选择评分
const selectRating = (rating) => {
  form.value.rating = rating
}

// 提交评论
const submitComment = async () => {
  if (!canSubmit.value) return
  
  try {
    await commentStore.submitComment(props.gameId, {
      name: form.value.nickname.trim(),
      text: form.value.comment.trim(),
      rating: form.value.rating
    })
    
    // 清空表单
    form.value = {
      nickname: '',
      rating: 0,
      comment: ''
    }
    hoverRating.value = 0
    
    alert('评论提交成功！')
  } catch (error) {
    alert('提交失败: ' + error.message)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

// 监听gameId变化，加载数据
watch(() => props.gameId, (newGameId) => {
  if (newGameId) {
    commentStore.loadData(newGameId)
  }
}, { immediate: true })

onMounted(() => {
  if (props.gameId) {
    commentStore.loadData(props.gameId)
  }
})
</script>

<style scoped>
.comment-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

/* 评分概览 */
.rating-overview {
  margin-bottom: 32px;
}

.rating-summary {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.rating-score {
  flex-shrink: 0;
  text-align: center;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.score-number {
  font-size: 32px;
  font-weight: 900;
  color: #2d3748;
  line-height: 1;
}

.score-stars {
  margin: 8px 0;
}

.score-stars .star {
  color: #e2e8f0;
  font-size: 20px;
  margin: 0 2px;
}

.score-stars .star.filled {
  color: #f6ad55;
}

.score-count {
  font-size: 14px;
  color: #718096;
}

.rating-distribution {
  flex: 1;
  padding: 16px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.rating-label {
  width: 30px;
  color: #718096;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #f6ad55;
  transition: width 0.3s ease;
}

.rating-count {
  width: 24px;
  text-align: right;
  color: #718096;
}

.no-ratings {
  flex: 1;
  text-align: center;
  padding: 32px;
  color: #a0aec0;
  font-style: italic;
}

/* 写评论 */
.write-comment {
  margin-bottom: 32px;
}

.comment-form {
  background: #f7fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.form-field {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
}

.required {
  color: #e53e3e;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #a0aec0;
  margin-top: 4px;
}

.rating-input {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.rating-star {
  font-size: 24px;
  color: #e2e8f0;
  cursor: pointer;
  transition: color 0.2s ease;
  user-select: none;
}

.rating-star.filled,
.rating-star.hover {
  color: #f6ad55;
}

.rating-selected {
  font-size: 12px;
  color: #38a169;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cooldown-notice {
  margin-top: 8px;
  padding: 8px 12px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.form-notice {
  margin-top: 8px;
  font-size: 12px;
  color: #a0aec0;
  text-align: center;
}

/* 评论列表 */
.comments-list {
  margin-top: 32px;
}

.loading-text {
  text-align: center;
  color: #a0aec0;
  padding: 24px;
  font-size: 14px;
}

.no-comments {
  text-align: center;
  color: #a0aec0;
  padding: 32px;
  font-style: italic;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #2d3748;
}

.comment-date {
  font-size: 12px;
  color: #a0aec0;
}

.comment-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.rating-label {
  color: #718096;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-stars .star {
  color: #e2e8f0;
  font-size: 14px;
}

.rating-stars .star.filled {
  color: #f6ad55;
}

.comment-text {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.muted {
  color: #a0aec0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comment-section {
    padding: 16px;
  }
  
  .rating-summary {
    flex-direction: column;
    gap: 16px;
  }
  
  .rating-score {
    align-self: center;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
