<template>
  <main class="privacy-policy-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 页面头部 -->
    <section class="page-header" aria-labelledby="page-title">
      <div class="header-content">
        <h1 id="page-title" class="page-title">Privacy Policy</h1>
        <p class="page-subtitle">How we protect your information</p>
      </div>
    </section>

    <!-- 隐私政策内容 -->
    <section class="policy-section" aria-labelledby="policy-title">
      <div class="policy-container">
        <div class="policy-content">
          <h2 id="policy-title" class="section-title">Privacy Policy</h2>
          <p class="policy-date">Last updated: August 6, 2025</p>

          <div class="policy-text">
            <h3>Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you use our services
              or contact us for support.
            </p>

            <h3>How We Use Your Information</h3>
            <p>
              We use the information we collect to provide, maintain, and improve our services, and
              to communicate with you.
            </p>

            <h3>Information Sharing</h3>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third
              parties without your consent.
            </p>

            <h3>Data Security</h3>
            <p>
              We implement appropriate security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h3>Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at
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
.privacy-policy-view {
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

.policy-section {
  padding: 40px 24px;
  position: relative;
  z-index: 1;
}

.policy-container {
  max-width: 800px;
  margin: 0 auto;
}

.policy-content {
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

.policy-date {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 30px;
}

.policy-text h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 30px 0 10px;
  color: #374151;
}

.policy-text p {
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

  .policy-content {
    padding: 30px 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .policy-text h3 {
    font-size: 18px;
  }

  .policy-text p {
    font-size: 14px;
  }
}
</style> 