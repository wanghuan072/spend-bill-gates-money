<template>
  <main class="about-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 页面头部 -->
    <section class="page-header" aria-labelledby="page-title">
      <div class="header-content">
        <h1 id="page-title" class="page-title">About Us</h1>
        <p class="page-subtitle">About Spend Bill Gates Money</p>
      </div>
    </section>

    <!-- 版权信息内容 -->
    <section class="copyright-section">
      <div class="container">
        <div class="about-content">
          <h2>Who We Are</h2>
          <p>["spendgatesmoney.com"] is a leading platform dedicated to providing high-quality content, guides, and resources for
            our community. We are a passionate team of creators, researchers, and enthusiasts who aim to
            deliver accurate, engaging, and valuable information across various fields.</p>

          <h2>Our Mission</h2>
          <p>Our mission is to empower users by offering reliable knowledge, practical strategies, and
            community-driven insights. Whether it’s games, technology, lifestyle, or creative resources, we
            strive to become the go-to source for trustworthy and up-to-date content.</p>

          <h2>What We Offer</h2>
          <ul>
            <li><strong>Guides & Tutorials:</strong> Comprehensive resources to help users learn, grow, and
              solve problems.</li>
            <li><strong>Latest Updates:</strong> Regularly refreshed content to ensure relevance and
              accuracy.</li>
            <li><strong>Community Resources:</strong> A hub for collaboration, knowledge sharing, and
              meaningful interaction.</li>
            <li><strong>Special Features:</strong> Exclusive insights, tools, and curated content for our
              audience.</li>
          </ul>

          <h2>Our Commitment</h2>
          <p>We are committed to maintaining a high standard of quality, integrity, and transparency in
            everything we publish. Our team works continuously to verify information, update resources, and
            ensure our platform remains reliable and user-focused.</p>

          <h2>Community Focus</h2>
          <p>At ["spendgatesmoney.com"], we believe in the power of community. Our platform is designed to connect people,
            encourage collaboration, and foster a positive environment where everyone can learn and
            contribute.</p>

          <h2>Quality Assurance</h2>
          <p>Accuracy is at the core of what we do. Every piece of content is carefully reviewed and verified
            by our team to ensure it meets the highest standards before being published on ["spendgatesmoney.com"].</p>

          <h2>Regular Updates</h2>
          <p>We update our resources frequently to keep pace with industry changes, community needs, and user
            feedback. This ensures that our audience always has access to the most relevant and valuable
            information.</p>

          <h2>Contact Us</h2>
          <p>Have questions, suggestions, or feedback? We’d love to hear from you! You can reach us at <a
              href="mailto:[wyong@spendgatesmoney.com]">[wyong@spendgatesmoney.com]</a> and we’ll get back to you as soon as
            possible.</p>

          <h2>Join Our Community</h2>
          <p>Stay connected with ["spendgatesmoney.com"] by following our updates and engaging with the community. Together, we
            can build a stronger, more informed, and more supportive space for everyone.</p>
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
.about-view {
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

.about-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 50px;
  max-width: 900px;
  margin: 0 auto 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.about-content section {
  margin-bottom: 20px;
}

.about-content section:last-child {
  margin-bottom: 0;
}

.about-content h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1f2937;
  position: relative;
  padding-left: 15px;
  line-height: 1.5;
}

.about-content h2:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

.about-content p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 20px;
}

.about-content ul {
  margin-bottom: 20px;
  padding-left: 0;
}

.about-content li {
  list-style: none;
  position: relative;
  padding: 10px 0 10px 20px;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.about-content li:before {
  content: '·';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  color: #667eea;
  font-weight: bold;
  font-size: 18px;
}

.about-content strong {
  color: #1f2937;
  font-weight: 600;
}

.about-content a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.about-content a:hover {
  color: #764ba2;
  border-bottom-color: #764ba2;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 20px 10px 20px;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .about-content {
    padding: 10px;
    border-radius: 16px;
  }

  .about-content h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .about-content ul {
    margin-bottom: 10px;
  }

  .about-content p,
  .about-content li {
    font-size: 12px;
    line-height: 1.4;
  }

  .about-content li {
    padding: 5px 0 5px 10px;
  }

  .about-content p {
    margin-bottom: 10px;
  }
}
</style>