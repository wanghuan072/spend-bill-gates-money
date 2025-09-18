<template>
  <section class="hot-games" aria-labelledby="hot-games-title">
    <div class="hot-games-container">
      <div class="hot-games-header">
        <h2 id="hot-games-title" class="hot-games-title">Hot Games</h2>
        <p class="hot-games-subtitle">More exciting games waiting for you</p>
      </div>

      <div class="hot-games-grid">
        <div
          v-for="game in hotGames"
          :key="game.id"
          class="hot-game-item"
          @click="selectGame(game.addressBar)"
        >
          <div class="hot-game-image">
            <img :src="game.imageUrl" :alt="game.imageAlt" />
            <div class="hot-game-overlay">
              <span class="play-text">Play Game</span>
            </div>
          </div>
          <h3 class="hot-game-title">{{ game.title }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { games } from '../data/games.js'

const props = defineProps({
  excludeAddressBar: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select'])

// 获取热门游戏
const getHotGames = () => {
  return games.filter((game) => game.isHot)
}

// 获取热门游戏，排除当前游戏
const hotGames = getHotGames().filter((game) => game.addressBar !== props.excludeAddressBar)

const selectGame = (addressBar) => {
  emit('select', addressBar)
}
</script>

<style scoped>
.hot-games {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin-top: 40px;
}

.hot-games-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hot-games-header {
  text-align: center;
  margin-bottom: 32px;
}

.hot-games-title {
  font-size: 28px;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hot-games-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

.hot-games-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
  margin-top: 32px;
}

.hot-game-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.hot-game-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.hot-game-image {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.hot-game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hot-game-item:hover .hot-game-image img {
  transform: scale(1.1);
}

.hot-game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hot-game-item:hover .hot-game-overlay {
  opacity: 1;
}

.play-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hot-game-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  padding: 12px 16px;
  text-align: center;
  line-height: 1.3;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hot-games {
    padding: 30px 0;
    margin-top: 30px;
  }

  .hot-games-container {
    padding: 0 20px;
  }

  .hot-games-title {
    font-size: 24px;
  }

  .hot-games-subtitle {
    font-size: 14px;
  }

  .hot-games-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .hot-game-image {
    height: 100px;
  }

  .hot-game-title {
    font-size: 13px;
    padding: 10px 12px;
  }
}

@media (max-width: 768px) {
  .hot-games {
    padding: 20px 0;
    margin-top: 20px;
  }

  .hot-games-container {
    padding: 0 16px;
  }

  .hot-games-header {
    margin-bottom: 20px;
  }

  .hot-games-title {
    font-size: 20px;
  }

  .hot-games-subtitle {
    font-size: 12px;
  }

  .hot-games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 20px;
  }

  .hot-game-image {
    height: 80px;
  }

  .hot-game-title {
    font-size: 12px;
    padding: 8px 10px;
  }

  .play-text {
    font-size: 12px;
  }
}
</style> 