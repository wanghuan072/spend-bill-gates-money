<template>
  <main class="games-view" role="main">
    <!-- 头部组件 -->
    <Header />

    <!-- 页面头部 -->
    <section class="page-header" aria-labelledby="page-title">
      <div class="header-content">
        <h1 id="page-title" class="page-title">Game Center</h1>
        <p class="page-subtitle">Selected classic games, enjoy gaming fun anytime, anywhere</p>
      </div>
    </section>

    <!-- 游戏列表 -->
    <section class="games-section" aria-labelledby="games-title">
      <div class="games-container">
        <div class="section-header">
          <h2 id="games-title" class="section-title">All Games</h2>
        </div>
        <div class="games-grid" role="list" aria-label="Games list">
          <GameCard
            v-for="game in gamesList"
            :key="game.id"
            :game="game"
            @play="navigateToGame"
            role="listitem"
          />
        </div>
      </div>
    </section>

    <!-- 底部Footer -->
    <Footer />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import GameCard from '../components/GameCard.vue'
import Footer from '../components/Footer.vue'
import { games } from '../data/games.js'

const router = useRouter()

// 获取所有游戏
const getAllGames = () => {
  return games
}

const gamesList = getAllGames()

const navigateToGame = (addressBar) => {
  router.push(`/games/${addressBar}`)
}
</script>

<style scoped>
.games-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.games-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

/* 页面头部 */
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
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: titleFloat 4s ease-in-out infinite;
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.page-subtitle {
  font-size: 18px;
  color: #4a5568;
  margin: 0;
  font-weight: 500;
  opacity: 0.8;
}

/* 游戏列表区域 */
.games-section {
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.games-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: left;
  margin-bottom: 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.games-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 15px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-header {
    padding: 40px 16px 30px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .games-section {
    padding: 30px 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .games-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 10px 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .games-section {
    padding: 20px 10px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .section-subtitle {
    font-size: 12px;
  }

  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 20px;
  }
}
</style> 