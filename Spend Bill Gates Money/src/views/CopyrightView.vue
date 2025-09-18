<template>
  <main class="copyright-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 页面头部 -->
    <section class="page-header" aria-labelledby="page-title">
      <div class="header-content">
        <h1 id="page-title" class="page-title">Copyright</h1>
        <p class="page-subtitle">Intellectual property rights</p>
      </div>
    </section>

    <!-- 版权信息内容 -->
    <section class="copyright-section" aria-labelledby="copyright-title">
      <div class="copyright-container">
        <div class="copyright-content">
          <h2 id="copyright-title" class="section-title">Copyright Notice</h2>
          <p class="copyright-date">Last updated: August 6, 2025</p>

          <div class="copyright-text">
            <h3>Copyright Protection</h3>
            <p>
              All content on this website, including but not limited to text, graphics, images,
              logos, and software, is the property of SpendBillMoney.com and is protected by
              copyright laws.
            </p>

            <h3>Permitted Uses</h3>
            <p>
              You may view, download, and print content from this website for your personal,
              non-commercial use only, provided that you retain all copyright and other proprietary
              notices.
            </p>

            <h3>Restricted Uses</h3>
            <p>
              You may not reproduce, distribute, modify, or create derivative works from any content
              on this website without our prior written consent.
            </p>

            <h3>Trademarks</h3>
            <p>
              All trademarks, service marks, and trade names used on this website are the property
              of their respective owners.
            </p>

            <h3>Contact Information</h3>
            <p>
              For copyright inquiries or permission requests, please contact us at
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
.copyright-view {
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

.copyright-section {
  padding: 40px 24px;
  position: relative;
  z-index: 1;
}

.copyright-container {
  max-width: 800px;
  margin: 0 auto;
}

.copyright-content {
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

.copyright-date {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 30px;
}

.copyright-text h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 30px 0 10px;
  color: #374151;
}

.copyright-text p {
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

  .copyright-content {
    padding: 30px 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .copyright-text h3 {
    font-size: 18px;
  }

  .copyright-text p {
    font-size: 14px;
  }
}
</style> 