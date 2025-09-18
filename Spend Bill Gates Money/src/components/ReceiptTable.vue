<template>
  <div class="receipt-container" role="document" aria-labelledby="receipt-title">
    <header class="receipt-header">
      <h2 id="receipt-title" class="receipt-title">Receipt</h2>
      <button class="close-btn" @click="$emit('close')" aria-label="Close receipt">
        <span class="close-icon" aria-hidden="true">✕</span>
      </button>
    </header>
    <div class="receipt-info">
      <p class="receipt-description">Your purchase summary</p>
    </div>
    <div class="receipt-content" v-if="finalPurchases.length > 0">
      <div class="receipt-table" role="table" aria-label="Purchase summary">
        <div class="table-header" role="row">
          <div class="header-item" role="columnheader">Item</div>
          <div class="header-item" role="columnheader">Quantity</div>
          <div class="header-item" role="columnheader">Price</div>
          <div class="header-item" role="columnheader">Total</div>
        </div>
        <div class="table-body">
          <div v-for="item in finalPurchases" :key="item.productId" class="table-row" role="row">
            <div class="table-cell item-name" role="cell">{{ item.productName }}</div>
            <div class="table-cell item-quantity" role="cell">{{ item.quantity }}</div>
            <div class="table-cell item-price" role="cell">{{ formatCurrency(item.price) }}</div>
            <div class="table-cell item-total" role="cell">
              {{ formatCurrency(item.totalCost) }}
            </div>
          </div>
        </div>
      </div>
      <div class="receipt-summary" role="region" aria-label="Total summary">
        <div class="summary-item total">
          <span class="summary-label">TOTAL:</span>
          <span class="summary-value">{{ formatCurrency(totalSpent) }}</span>
        </div>
      </div>
    </div>
    <div class="receipt-empty" v-else role="status" aria-live="polite">
      <div class="empty-icon" aria-hidden="true">📄</div>
      <h3 class="empty-title">No Purchases Yet</h3>
      <p class="empty-description">Start shopping to see your receipt here</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

defineProps({
  showReceipt: {
    type: Boolean,
    required: true,
  },
})

const gameStore = useGameStore()

const formatCurrency = (amount) => {
  return gameStore.formatCurrency(amount)
}

const finalPurchases = computed(() => {
  const purchases = []
  gameStore.currentProducts.forEach((product) => {
    const quantity = gameStore.getProductQuantity(product.id)
    if (quantity > 0) {
      purchases.push({
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        price: product.price,
        totalCost: product.price * quantity,
      })
    }
  })
  return purchases
})

const totalSpent = computed(() => {
  return finalPurchases.value.reduce((total, item) => total + item.totalCost, 0)
})
</script>

<style scoped>
.receipt-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 900px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.receipt-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #a8edea, #fed6e3, #ffecd2, #fcb69f);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
  border-radius: 24px 24px 0 0;
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

.receipt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(160, 174, 192, 0.2);
}

.receipt-title {
  font-size: 28px;
  font-weight: 800;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(135deg, #2d3748, #4a5568);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(160, 174, 192, 0.1);
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
}

.close-btn:hover {
  background: rgba(160, 174, 192, 0.2);
  color: #2d3748;
  transform: scale(1.1);
}

.close-icon {
  font-weight: bold;
}

.receipt-info {
  margin-bottom: 24px;
}

.receipt-description {
  color: #718096;
  font-size: 14px;
  margin: 0;
  font-weight: 400;
}

.receipt-table {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(160, 174, 192, 0.2);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: rgba(160, 174, 192, 0.1);
  padding: 16px 20px;
  font-weight: 700;
  color: #2d3748;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-item {
  display: flex;
  align-items: center;
}

.table-body {
  background: white;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(160, 174, 192, 0.1);
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: rgba(160, 174, 192, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #2d3748;
}

.item-name {
  font-weight: 600;
}

.item-quantity {
  font-weight: 700;
  color: #667eea;
}

.item-price {
  font-weight: 600;
  color: #718096;
}

.item-total {
  font-weight: 800;
  color: #2d3748;
}

.receipt-summary {
  padding: 20px;
  background: rgba(160, 174, 192, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(160, 174, 192, 0.2);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item.total {
  font-size: 18px;
  font-weight: 800;
  color: #2d3748;
  padding-top: 8px;
  border-top: 1px solid rgba(160, 174, 192, 0.2);
}

.summary-label {
  color: #718096;
}

.summary-value {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
}

.receipt-empty {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px;
}

.empty-description {
  color: #718096;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

/* 自定义滚动条 */
.receipt-container::-webkit-scrollbar {
  width: 8px;
}

.receipt-container::-webkit-scrollbar-track {
  background: rgba(160, 174, 192, 0.1);
  border-radius: 4px;
}

.receipt-container::-webkit-scrollbar-thumb {
  background: rgba(160, 174, 192, 0.3);
  border-radius: 4px;
}

.receipt-container::-webkit-scrollbar-thumb:hover {
  background: rgba(160, 174, 192, 0.5);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .receipt-container {
    max-width: 800px;
    padding: 24px;
    max-height: 75vh;
  }

  .receipt-title {
    font-size: 24px;
  }

  .receipt-description {
    font-size: 13px;
  }

  .table-header {
    padding: 14px 16px;
    font-size: 13px;
  }

  .table-row {
    padding: 14px 16px;
  }

  .table-cell {
    font-size: 13px;
  }

  .summary-item.total {
    font-size: 16px;
  }

  .empty-title {
    font-size: 20px;
  }

  .empty-description {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .receipt-container {
    max-width: 100%;
    margin: 10px;
    padding: 10px;
    max-height: 90vh;
    border-radius: 16px;
  }

  .receipt-header {
    margin-bottom: 10px;
    padding-bottom: 10px;
  }

  .receipt-title {
    font-size: 20px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .receipt-info {
    margin-bottom: 16px;
  }

  .receipt-description {
    font-size: 12px;
  }

  .receipt-table {
    margin-bottom: 16px;
  }

  .table-header {
    grid-template-columns: 1.5fr 0.8fr 0.8fr 0.8fr;
    padding: 10px 12px;
    font-size: 12px;
  }

  .table-row {
    grid-template-columns: 1.5fr 0.8fr 0.8fr 0.8fr;
    padding: 10px 12px;
  }

  .table-cell {
    font-size: 12px;
  }

  .receipt-summary {
    padding: 12px;
  }

  .summary-item.total {
    font-size: 14px;
    padding-top: 6px;
  }

  .receipt-empty {
    padding: 40px 10px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-title {
    font-size: 16px;
    margin-bottom: 6px;
  }

  .empty-description {
    font-size: 12px;
  }
}
</style> 