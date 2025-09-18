<template>
  <main class="terms-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 页面头部 -->
    <section class="page-header" aria-labelledby="page-title">
      <div class="header-content">
        <h1 id="page-title" class="page-title">Terms of Service</h1>
        <p class="page-subtitle">Website usage agreement</p>
      </div>
    </section>

    <!-- 服务条款内容 -->
    <section class="terms-section" aria-labelledby="terms-title">
      <div class="terms-container">
        <div class="terms-content">
          <h2 id="terms-title" class="section-title">Terms of Service</h2>
          <p class="terms-date">Last updated: August 6, 2025</p>

          <div class="terms-text">
            <h3>Acceptance of Terms</h3>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>

            <h3>Use License</h3>
            <p>
              Permission is granted to temporarily download one copy of the materials on this
              website for personal, non-commercial transitory viewing only.
            </p>

            <h3>Disclaimer</h3>
            <p>
              The materials on this website are provided on an 'as is' basis. We make no warranties,
              expressed or implied, and hereby disclaim and negate all other warranties including
              without limitation, implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property or other violation of
              rights.
            </p>

            <h3>Limitations</h3>
            <p>
              In no event shall we or our suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption)
              arising out of the use or inability to use the materials on our website.
            </p>

            <h3>Contact Information</h3>
            <p>
              If you have any questions about these Terms of Service, please contact us at
              kadiyamobi89@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部Footer -->
    <Footer />
  </main>
</template>

<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
</script>

<style scoped>
.terms-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.page-header {
  padding: 60px 24px 40px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.terms-section {
  padding: 40px 24px;
  position: relative;
  z-index: 1;
}

.terms-container {
  max-width: 800px;
  margin: 0 auto;
}

.terms-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px;
  color: #1f2937;
  text-align: center;
}

.terms-date {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 30px;
}

.terms-text h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 30px 0 10px;
  color: #374151;
}

.terms-text p {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .terms-content {
    padding: 30px 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .terms-text h3 {
    font-size: 18px;
  }

  .terms-text p {
    font-size: 14px;
  }
}
</style> 