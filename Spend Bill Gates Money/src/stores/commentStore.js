import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { commentAPI, ratingAPI, adminAPI } from '../services/commentApi.js'

export const useCommentStore = defineStore('comment', () => {
  // 状态
  const comments = ref({}) // 按pageId组织的评论数据 { pageId: [comments] }
  const ratings = ref({}) // 按pageId组织的评分数据 { pageId: { average, count, ratings } }
  const loading = ref(false)
  const submitting = ref(false)
  
  // 管理员相关状态
  const adminToken = ref(localStorage.getItem('admin_token') || null)
  const adminUser = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))
  const adminData = ref({}) // 管理员看到的所有游戏数据
  
  // 提交限制
  const lastSubmitTime = ref(null)
  const submitCooldown = 60 * 1000 // 1分钟冷却时间
  
  // 计算属性
  const isAdmin = computed(() => !!adminToken.value)
  
  const canSubmit = computed(() => {
    if (!lastSubmitTime.value) return true
    return Date.now() - lastSubmitTime.value >= submitCooldown
  })
  
  const remainingCooldown = computed(() => {
    if (!lastSubmitTime.value) return 0
    const remaining = submitCooldown - (Date.now() - lastSubmitTime.value)
    return Math.max(0, Math.ceil(remaining / 1000))
  })
  
  // 获取指定页面的评论
  const getComments = (pageId) => {
    return comments.value[pageId] || []
  }
  
  // 获取指定页面的评分统计
  const getRatings = (pageId) => {
    const data = ratings.value[pageId] || { average: 0, count: 0, ratings: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } }
    
    // 确保数据类型正确
    return {
      average: parseFloat(data.average) || 0,
      count: parseInt(data.count) || 0,
      ratings: {
        '1': parseInt(data.ratings?.['1']) || 0,
        '2': parseInt(data.ratings?.['2']) || 0,
        '3': parseInt(data.ratings?.['3']) || 0,
        '4': parseInt(data.ratings?.['4']) || 0,
        '5': parseInt(data.ratings?.['5']) || 0
      }
    }
  }
  
  // 加载评论和评分数据
  const loadData = async (pageId) => {
    if (!pageId) return
    
    loading.value = true
    try {
      // 并行加载评论和评分数据
      const [commentsData, ratingsData] = await Promise.all([
        commentAPI.getComments(pageId),
        ratingAPI.getRatings(pageId)
      ])
      
      comments.value[pageId] = commentsData || []
      
      // 处理评分数据，确保类型正确
      const processedRatings = ratingsData || { average: 0, count: 0, ratings: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } }
      ratings.value[pageId] = {
        average: parseFloat(processedRatings.average) || 0,
        count: parseInt(processedRatings.count) || 0,
        ratings: {
          '1': parseInt(processedRatings.ratings?.['1']) || 0,
          '2': parseInt(processedRatings.ratings?.['2']) || 0,
          '3': parseInt(processedRatings.ratings?.['3']) || 0,
          '4': parseInt(processedRatings.ratings?.['4']) || 0,
          '5': parseInt(processedRatings.ratings?.['5']) || 0
        }
      }
    } catch (error) {
      console.error('加载评论数据失败:', error)
      // 如果API不可用，使用空数据
      comments.value[pageId] = []
      ratings.value[pageId] = { average: 0, count: 0, ratings: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } }
    } finally {
      loading.value = false
    }
  }
  
  // 提交评论和评分
  const submitComment = async (pageId, commentData) => {
    if (!canSubmit.value) {
      throw new Error(`请等待 ${remainingCooldown.value} 秒后再次提交`)
    }
    
    submitting.value = true
    try {
      const newComment = await commentAPI.submitComment({
        pageId,
        ...commentData
      })
      
      // 重新加载数据以获取最新统计
      await loadData(pageId)
      
      // 设置提交时间限制
      lastSubmitTime.value = Date.now()
      
      return newComment
    } catch (error) {
      throw error
    } finally {
      submitting.value = false
    }
  }
  
  // 管理员登录
  const adminLogin = async (credentials) => {
    try {
      const response = await adminAPI.login(credentials)
      
      adminToken.value = response.token
      adminUser.value = response.user
      
      // 保存到localStorage
      localStorage.setItem('admin_token', response.token)
      localStorage.setItem('admin_user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  // 管理员登出
  const adminLogout = () => {
    adminToken.value = null
    adminUser.value = null
    adminData.value = {}
    
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }
  
  // 加载管理员数据
  const loadAdminData = async () => {
    if (!adminToken.value) return
    
    loading.value = true
    try {
      const data = await adminAPI.getAllGameData(adminToken.value)
      adminData.value = data
    } catch (error) {
      console.error('加载管理员数据失败:', error)
      // 如果token过期，清除登录状态
      if (error.message.includes('token') || error.message.includes('认证')) {
        adminLogout()
      }
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // 删除反馈
  const deleteFeedback = async (pageId, feedbackId) => {
    if (!adminToken.value) throw new Error('需要管理员权限')
    
    try {
      await adminAPI.deleteFeedback(pageId, feedbackId, adminToken.value)
      // 重新加载管理员数据
      await loadAdminData()
    } catch (error) {
      throw error
    }
  }
  
  // 添加手动反馈
  const addManualFeedback = async (feedbackData) => {
    if (!adminToken.value) throw new Error('需要管理员权限')
    
    try {
      const newFeedback = await adminAPI.addManualFeedback(feedbackData, adminToken.value)
      // 重新加载管理员数据
      await loadAdminData()
      return newFeedback
    } catch (error) {
      throw error
    }
  }
  
  // 更新反馈
  const updateFeedback = async (pageId, feedbackId, feedbackData) => {
    if (!adminToken.value) throw new Error('需要管理员权限')
    
    try {
      const updatedFeedback = await adminAPI.updateFeedback(pageId, feedbackId, feedbackData, adminToken.value)
      // 重新加载管理员数据
      await loadAdminData()
      return updatedFeedback
    } catch (error) {
      throw error
    }
  }
  
  // 更新评分
  const updateRatings = async (pageId, ratingsData) => {
    if (!adminToken.value) throw new Error('需要管理员权限')
    
    try {
      await adminAPI.updateRatings(pageId, ratingsData, adminToken.value)
      // 重新加载管理员数据
      await loadAdminData()
    } catch (error) {
      throw error
    }
  }
  
  return {
    // 状态
    comments,
    ratings,
    loading,
    submitting,
    adminToken,
    adminUser,
    adminData,
    
    // 计算属性
    isAdmin,
    canSubmit,
    remainingCooldown,
    
    // 方法
    getComments,
    getRatings,
    loadData,
    submitComment,
    
    // 管理员方法
    adminLogin,
    adminLogout,
    loadAdminData,
    deleteFeedback,
    addManualFeedback,
    updateFeedback,
    updateRatings
  }
})
