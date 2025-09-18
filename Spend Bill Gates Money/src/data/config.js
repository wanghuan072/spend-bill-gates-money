import { billGatesData } from './characters/billGates.js'
import { elonMuskData } from './characters/elonMusk.js'
import { jeffBezosData } from './characters/jeffBezos.js'

// 所有可用的人物角色列表
export const availableCharacters = {
  'bill-gates': billGatesData,
  'elon-musk': elonMuskData,
  'jeff-bezos': jeffBezosData
}

// 当前选择的人物角色（后期可以扩展为人物选择器）
// 这里设置为Bill Gates，可以轻松切换为其他人物
export const currentCharacter = billGatesData

// 游戏的基础配置对象，包含所有核心设置
export const gameConfig = {
  // 当前人物的初始资产余额，从人物数据中获取
  // 这个值决定了游戏开始时的可用资金
  initialBalance: currentCharacter.initialBalance,
  
  // 本地存储的键名配置，用于保存游戏进度
  // 每个键对应不同的游戏数据，便于单独管理
  storageKeys: {
    // 保存当前余额的键名
    balance: 'spend-money-balance',
    // 保存购买历史的键名
    purchaseHistory: 'spend-money-purchase-history',
    // 保存商品数量的键名
    productQuantities: 'spend-money-product-quantities',
    // 保存当前选择的人物的键名
    currentCharacter: 'spend-money-current-character'
  },
  
  // 货币格式化配置，用于显示金额
  // 使用Intl.NumberFormat API进行国际化货币显示
  currencyConfig: {
    // 地区设置，影响货币符号和数字格式
    locale: 'en-US',
    // 显示样式，'currency'表示货币格式
    style: 'currency',
    // 货币代码，USD表示美元
    currency: 'USD',
    // 最小小数位数，0表示不显示小数
    minimumFractionDigits: 0,
    // 最大小数位数，0表示不显示小数
    maximumFractionDigits: 0
  }
} 