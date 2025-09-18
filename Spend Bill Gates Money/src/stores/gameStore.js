import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gameConfig, availableCharacters } from '../data/config.js'

export const useGameStore = defineStore('game', () => {
  // 当前选择的人物
  const currentCharacter = ref(null)
  
  // 从配置文件获取初始余额
  const initialBalance = computed(() => {
    return currentCharacter.value?.initialBalance || 0
  })
  
  // 状态
  const balance = ref(0)
  const purchaseHistory = ref([])
  const productQuantities = ref({})
  const showReceipt = ref(false)
  const showMoneyExhaustedModal = ref(false)
  const hasTriggeredExhausted = ref(false) // 防止重复触发

  // 计算属性
  const spentAmount = computed(() => {
    return initialBalance.value - balance.value
  })

  const spentPercentage = computed(() => {
    return ((spentAmount.value / initialBalance.value) * 100).toFixed(8)
  })

  // 检查是否花完所有钱
  const isMoneyExhausted = computed(() => {
    return balance.value === 0 && initialBalance.value > 0
  })

  // 计算购买的商品总数
  const totalItemsPurchased = computed(() => {
    return Object.values(productQuantities.value).reduce((total, quantity) => total + quantity, 0)
  })

  // 格式化金额
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      gameConfig.currencyConfig.locale,
      gameConfig.currencyConfig
    ).format(amount)
  }

  // 切换人物
  const switchCharacter = (characterId) => {
    if (availableCharacters[characterId]) {
      currentCharacter.value = availableCharacters[characterId]
      // 切换角色时重置所有状态
      balance.value = currentCharacter.value.initialBalance
      purchaseHistory.value = []
      productQuantities.value = {}
    }
  }

  // 获取当前角色的产品列表
  const currentProducts = computed(() => {
    return currentCharacter.value?.products || []
  })
  
  // 购买商品
  const buyProduct = (productId, quantity) => {
    const product = currentProducts.value.find(p => p.id === productId)
    if (!product) return false

    const totalCost = product.price * quantity
    
    if (balance.value >= totalCost) {
      balance.value -= totalCost
      
      // 更新商品数量
      const currentQuantity = productQuantities.value[productId] || 0
      productQuantities.value[productId] = currentQuantity + quantity
      
      // 记录购买历史
      const historyItem = {
        id: Date.now(),
        type: 'buy',
        productId,
        productName: product.name,
        quantity,
        price: product.price,
        totalCost,
        timestamp: new Date()
      }
      
      purchaseHistory.value.unshift(historyItem)
      
      // 检查是否花完所有钱
      setTimeout(() => {
        checkMoneyExhausted()
      }, 100) // 稍作延迟确保UI更新完成
      
      return true
    }
    return false
  }

  // 出售商品
  const sellProduct = (productId, quantity) => {
    const product = currentProducts.value.find(p => p.id === productId)
    if (!product) return false

    const currentQuantity = productQuantities.value[productId] || 0
    if (currentQuantity < quantity) return false // 检查是否有足够的数量出售

    const totalRevenue = product.price * quantity
    balance.value += totalRevenue
    
    // 更新商品数量
    productQuantities.value[productId] = currentQuantity - quantity
    
    // 记录出售历史
    const historyItem = {
      id: Date.now(),
      type: 'sell',
      productId,
      productName: product.name,
      quantity,
      price: product.price,
      totalCost: totalRevenue,
      timestamp: new Date()
    }
    
    purchaseHistory.value.unshift(historyItem)
    return true
  }

  // 重置游戏
  const resetGame = () => {
    balance.value = initialBalance.value
    purchaseHistory.value = []
    productQuantities.value = {}
  }

  // 切换收据显示
  const toggleReceipt = () => {
    showReceipt.value = !showReceipt.value
  }

  // 获取商品数量
  const getProductQuantity = (productId) => {
    return productQuantities.value[productId] || 0
  }

  // 设置商品数量
  const setProductQuantity = (productId, quantity) => {
    productQuantities.value[productId] = quantity
  }

  // 检查并触发钱花完弹窗
  const checkMoneyExhausted = () => {
    if (isMoneyExhausted.value && !hasTriggeredExhausted.value) {
      hasTriggeredExhausted.value = true
      showMoneyExhaustedModal.value = true
    }
  }

  // 关闭钱花完弹窗
  const closeMoneyExhaustedModal = () => {
    showMoneyExhaustedModal.value = false
  }

  // 重新开始游戏（从钱花完弹窗）
  const restartFromExhausted = () => {
    resetGame()
    showMoneyExhaustedModal.value = false
    hasTriggeredExhausted.value = false
  }

  return {
    currentCharacter,
    balance,
    purchaseHistory,
    showReceipt,
    spentAmount,
    spentPercentage,
    isMoneyExhausted,
    totalItemsPurchased,
    showMoneyExhaustedModal,
    switchCharacter,
    buyProduct,
    sellProduct,
    formatCurrency,
    resetGame,
    toggleReceipt,
    getProductQuantity,
    setProductQuantity,
    checkMoneyExhausted,
    closeMoneyExhaustedModal,
    restartFromExhausted,
    currentProducts,
    availableCharacters
  }
}) 