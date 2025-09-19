<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 导航链接 -->
      <div class="footer-nav">
        <a href="/contact" class="footer-link">Contact Us</a>
        <a href="/privacy-policy" class="footer-link">Privacy Policy</a>
        <a href="/terms-of-service" class="footer-link">Terms of Use</a>
        <a href="/copyright" class="footer-link">Copyrights</a>
        <a href="/about" class="footer-link">About</a>
      </div>

      <!-- 版权信息 -->
      <div class="footer-copyright">
        <p>© August 6, 2025 spendgatesmoney.com - All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer组件不需要额外的逻辑
</script>

<style scoped>
.footer {
  background-color: #f8fafc;
  padding: 2rem 0;
  margin-top: auto;
  border-top: 1px solid #e2e8f0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.footer-nav {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #334155;
  text-decoration: underline;
}

.footer-copyright {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
}

.footer-copyright p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: 1.5rem 0;
  }

  .footer-nav {
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .footer-link {
    font-size: 0.8rem;
  }

  .footer-copyright {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .footer-nav {
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-link {
    font-size: 0.75rem;
  }

  .footer-copyright {
    font-size: 0.75rem;
  }
}
</style> 