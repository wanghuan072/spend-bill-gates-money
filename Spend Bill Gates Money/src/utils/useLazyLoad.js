/**
 * 懒加载工具函数 - 使用 Intersection Observer API
 */
import { ref, onUnmounted } from 'vue'

/**
 * 图片懒加载 Hook
 * @param {string} rootMargin - 提前加载的边距，默认 '50px'
 * @returns {Object} 包含 observe 和 unobserve 方法
 */
export function useLazyImage(rootMargin = '50px') {
  let imageObserver = null

  const observe = (el) => {
    if (!el) return

    // 如果 observer 还未创建，先创建
    if (!imageObserver) {
      imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target
              const src = img.dataset.src
              
              if (src) {
                // 加载图片
                img.src = src
                img.removeAttribute('data-src')
                img.classList.add('loaded')
                
                // 停止观察已加载的图片
                if (imageObserver) {
                  imageObserver.unobserve(img)
                }
              }
            }
          })
        },
        {
          rootMargin,
          threshold: 0.01
        }
      )
    }

    // 观察元素
    if (imageObserver && el) {
      imageObserver.observe(el)
    }
  }

  const unobserve = (el) => {
    if (imageObserver && el) {
      imageObserver.unobserve(el)
    }
  }

  const disconnect = () => {
    if (imageObserver) {
      imageObserver.disconnect()
      imageObserver = null
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    unobserve,
    disconnect
  }
}

/**
 * 元素懒加载 Hook - 用于判断元素是否进入视口
 * @param {string} rootMargin - 提前加载的边距，默认 '100px'
 * @returns {Object} 包含 isVisible ref 和 observe 方法
 */
export function useLazyElement(rootMargin = '100px') {
  const isVisible = ref(false)
  let observer = null

  const observe = (el) => {
    if (!el) return

    // 如果已经可见，直接返回
    if (isVisible.value) return

    // 如果 observer 已存在，先断开
    if (observer) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (observer) {
            observer.unobserve(el)
            observer.disconnect()
            observer = null
          }
        }
      },
      {
        rootMargin,
        threshold: 0.01
      }
    )

    observer.observe(el)
  }

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    isVisible,
    observe
  }
}

