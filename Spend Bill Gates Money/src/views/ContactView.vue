<template>
  <main class="contact-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 页面头部 -->
    <section class="page-header" aria-labelledby="page-title">
      <div class="header-content">
        <h1 id="page-title" class="page-title">Contact Us</h1>
        <p class="page-subtitle">Get in touch with us for any questions or support</p>
      </div>
    </section>

    <!-- 联系信息 -->
    <section class="contact-section" aria-labelledby="contact-title">
      <div class="contact-container">
        <div class="contact-content">
          <h2 id="contact-title" class="section-title">Get in Touch</h2>
          <p class="contact-description">
            Have questions about our games or need technical support? We're here to help!
          </p>

          <div class="contact-info">
            <div class="contact-item">
              <h3>Email</h3>
              <p>kadiyamobi89@gmail.com</p>
            </div>
            <div class="contact-item">
              <h3>Response Time</h3>
              <p>We typically respond within 24 hours</p>
            </div>
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
.contact-view {
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

.contact-section {
  padding: 40px 24px;
  position: relative;
  z-index: 1;
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
}

.contact-content {
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

.contact-description {
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.6;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.contact-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.contact-item h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #374151;
}

.contact-item p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .contact-content {
    padding: 30px 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .contact-info {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style> 