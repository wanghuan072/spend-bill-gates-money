<template>
  <div v-if="show" class="money-exhausted-modal" @click="handleBackdropClick">
    <div class="modal-content" @click.stop>
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="handleClose" aria-label="Close modal">
        <span>×</span>
      </button>
      
      <!-- 庆祝图片 -->
      <div class="celebration-image">
        <img 
          :src="characterImage" 
          :alt="`${characterName} celebration`"
          class="character-image"
        />
        <div class="celebration-effects">
          <div class="confetti"></div>
          <div class="sparkles">✨</div>
        </div>
      </div>
      
      <!-- 标题和消息 -->
      <div class="modal-header">
        <h2 class="congratulations-title">🎉 Congratulations!</h2>
        <h3 class="achievement-subtitle">You've Successfully Spent All the Money!</h3>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-label">Total Spent</span>
          <span class="stat-value">{{ formatCurrency(totalSpent) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Items Purchased</span>
          <span class="stat-value">{{ totalItems }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Completion</span>
          <span class="stat-value">100%</span>
        </div>
      </div>
      
      <!-- 成就描述 -->
      <div class="achievement-description">
        <p>You have successfully experienced what it's like to spend {{ characterName }}'s entire fortune!</p>
        <p>From small purchases to luxury items, you've mastered the art of spending billions.</p>
      </div>
      
      <!-- 行动按钮 -->
      <div class="modal-actions">
        <button class="action-btn secondary-btn" @click="handleViewReceipt">
          <span class="btn-icon">👀</span>
          View Receipt
        </button>
        <button class="action-btn primary-btn" @click="handleRestart">
          <span class="btn-icon">🔄</span>
          Start Over
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  characterName: {
    type: String,
    default: 'Bill Gates'
  },
  characterImage: {
    type: String,
    default: '/images/bill-gates.webp'
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  formatCurrency: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['close', 'restart', 'view-receipt'])

// 处理背景点击
const handleBackdropClick = () => {
  // 可以选择是否允许点击背景关闭
  // handleClose()
}

// 处理关闭
const handleClose = () => {
  emit('close')
}

// 处理重新开始
const handleRestart = () => {
  emit('restart')
}

// 查看收据
const handleViewReceipt = () => {
  emit('view-receipt')
}

</script>

<style scoped>
.money-exhausted-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  text-align: center;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 24px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.celebration-image {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.character-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.celebration-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, transparent 20%, rgba(255, 215, 0, 0.3) 20%, rgba(255, 215, 0, 0.3) 40%, transparent 40%),
              radial-gradient(circle, transparent 20%, rgba(255, 105, 180, 0.3) 20%, rgba(255, 105, 180, 0.3) 40%, transparent 40%);
  background-size: 20px 20px, 30px 30px;
  animation: confettiFall 3s ease-in-out infinite;
}

@keyframes confettiFall {
  0% {
    transform: translateX(-50%) translateY(-20px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(100px) rotate(360deg);
    opacity: 0;
  }
}

.sparkles {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  animation: sparkle 1.5s ease-in-out infinite alternate;
}

@keyframes sparkle {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.2) rotate(180deg);
    opacity: 1;
  }
}

.modal-header {
  margin-bottom: 32px;
}

.congratulations-title {
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: titlePulse 2s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.achievement-subtitle {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.stats-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.8;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.achievement-description {
  margin-bottom: 32px;
  line-height: 1.6;
}

.achievement-description p {
  margin: 0 0 12px;
  font-size: 16px;
  opacity: 0.9;
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  min-width: 140px;
  justify-content: center;
}

.primary-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.primary-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 18px;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .money-exhausted-modal {
    padding: 16px;
  }
  
  .modal-content {
    padding: 32px 24px;
  }
  
  .congratulations-title {
    font-size: 28px;
  }
  
  .achievement-subtitle {
    font-size: 18px;
  }
  
  .character-image {
    width: 100px;
    height: 100px;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-btn {
    width: 100%;
  }
  
}

/* 额外的庆祝动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.celebration-effects::before {
  content: '🎊';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 20px;
  animation: float 2s ease-in-out infinite;
  animation-delay: 0.5s;
}

.celebration-effects::after {
  content: '🎉';
  position: absolute;
  top: -10px;
  right: 20px;
  font-size: 20px;
  animation: float 2s ease-in-out infinite;
  animation-delay: 1s;
}

/* 滚动条样式 */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
