<template>
  <article class="product-card" role="article">
    <div class="product-image">
      <img :src="product.image" :alt="`${product.name} product image`" />
      <div class="image-overlay" aria-hidden="true"></div>
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price" aria-label="Product price">
        {{ formatCurrency(product.price) }}
      </p>
    </div>

    <div class="product-controls" role="group" aria-label="Product purchase controls">
      <button
        class="control-btn sell-btn"
        @click="handleSell"
        :disabled="quantity === 0"
        aria-label="Sell one unit of this product"
        :aria-describedby="`quantity-${product.id}`"
      >
        Sell
      </button>

      <div
        class="quantity-input-container"
        :id="`quantity-${product.id}`"
        aria-label="Quantity input"
      >
        <input
          type="number"
          class="quantity-input"
          :value="quantity"
          @input="handleQuantityChange"
          @blur="handleQuantityBlur"
          min="0"
          step="1"
          placeholder="0"
          :aria-label="`Set quantity for ${product.name}`"
        />
      </div>

      <button
        class="control-btn buy-btn"
        @click="handleBuy"
        :disabled="!canAfford"
        aria-label="Buy one unit of this product"
        :aria-describedby="`quantity-${product.id}`"
      >
        Buy
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const gameStore = useGameStore()
const quantity = computed(() => gameStore.getProductQuantity(props.product.id))

const canAfford = computed(() => {
  const totalCost = props.product.price * 1 // 每次只购买1个
  return gameStore.balance >= totalCost
})

// 处理数量输入变化
const handleQuantityChange = (event) => {
  const inputValue = event.target.value
  const newQuantity = parseInt(inputValue) || 0
  const currentQuantity = quantity.value

  // 如果输入值无效，直接返回
  if (isNaN(newQuantity) || newQuantity < 0) {
    return
  }

  const difference = newQuantity - currentQuantity

  if (difference > 0) {
    // 需要购买更多
    const cost = props.product.price * difference
    if (gameStore.balance >= cost) {
      gameStore.buyProduct(props.product.id, difference)
    } else {
      // 余额不足，计算最大可购买数量
      const maxAffordable = Math.floor(gameStore.balance / props.product.price)
      const maxQuantity = currentQuantity + maxAffordable
      event.target.value = maxQuantity
      if (maxAffordable > 0) {
        gameStore.buyProduct(props.product.id, maxAffordable)
      }
    }
  } else if (difference < 0) {
    // 需要出售
    const sellQuantity = Math.abs(difference)
    if (currentQuantity >= sellQuantity) {
      gameStore.sellProduct(props.product.id, sellQuantity)
    } else {
      // 数量不足，出售所有可用数量
      event.target.value = 0
      gameStore.sellProduct(props.product.id, currentQuantity)
    }
  }
}

// 处理输入框失去焦点
const handleQuantityBlur = (event) => {
  const value = parseInt(event.target.value)
  if (isNaN(value) || value < 0) {
    event.target.value = quantity.value
  }
}

const formatCurrency = (amount) => {
  return gameStore.formatCurrency(amount)
}

// 处理购买 - 增加数量并减少余额
const handleBuy = () => {
  if (gameStore.balance >= props.product.price) {
    gameStore.buyProduct(props.product.id, 1)
  }
}

// 处理出售 - 减少数量并增加余额
const handleSell = () => {
  if (quantity.value > 0) {
    gameStore.sellProduct(props.product.id, 1)
  }
}
</script>

<style scoped>
.product-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #a8edea, #fed6e3, #ffecd2, #fcb69f);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
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

.product-image {
  aspect-ratio: 3/2;
  margin-bottom: 10px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(168, 237, 234, 0.2), rgba(254, 214, 227, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.product-info {
  margin-bottom: 10px;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1;
  display: flex;
  align-items: center;
}

.product-price {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  height: 40px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* .control-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
} */

.control-btn:hover::before {
  left: 100%;
}

.buy-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.buy-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.buy-btn:disabled {
  background: linear-gradient(135deg, #cbd5e0, #a0aec0);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.sell-btn {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  color: #2d3748;
  box-shadow: 0 4px 12px rgba(255, 154, 158, 0.2);
}

.sell-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 154, 158, 0.3);
}

.sell-btn:disabled {
  background: linear-gradient(135deg, #cbd5e0, #a0aec0);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.quantity-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-input {
  width: 100%;
  padding: 5px 15px;
  background: rgba(160, 174, 192, 0.1);
  border: 2px solid rgba(160, 174, 192, 0.2);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  color: #2d3748;
  transition: all 0.3s ease;
  cursor: text;
  height: 40px;
  box-sizing: border-box;
}

.quantity-input:focus {
  outline: none;
  background: rgba(160, 174, 192, 0.15);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  color: #2d3748;
}

.quantity-input:hover {
  background: rgba(160, 174, 192, 0.15);
  border-color: rgba(160, 174, 192, 0.3);
  color: #2d3748;
}

/* 隐藏数字输入框的上下箭头 */
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.quantity-input::placeholder {
  color: rgba(45, 55, 72, 0.5);
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .product-card {
    padding: 20px;
  }

  .product-image {
    margin-bottom: 16px;
  }

  .product-name {
    font-size: 16px;
    min-height: 44px;
  }

  .product-price {
    font-size: 18px;
  }

  .control-btn {
    padding: 8px 10px;
    font-size: 11px;
    min-width: 50px;
    height: 36px;
  }

  .quantity-input {
    padding: 6px 14px;
    font-size: 18px;
    height: 36px;
  }
}

@media (max-width: 768px) {
  .product-card {
    padding: 10px;
  }

  .product-image {
    margin-bottom: 10px;
  }

  .product-name {
    font-size: 14px;
    min-height: auto;
    margin-bottom: 6px;
  }

  .product-price {
    font-size: 14px;
  }

  .product-controls {
    gap: 6px;
  }

  .control-btn {
    padding: 6px 8px;
    font-size: 10px;
    min-width: 40px;
    height: 32px;
  }

  .quantity-input {
    padding: 4px 12px;
    font-size: 16px;
    height: 32px;
  }
}
</style> 