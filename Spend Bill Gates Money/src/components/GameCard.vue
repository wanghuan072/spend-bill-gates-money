<template>
  <article class="game-card" role="article" @click="playGame">
    <div class="game-image">
      <img :src="game.imageUrl" :alt="game.imageAlt" />
      <div class="image-overlay" aria-hidden="true"></div>
    </div>

    <div class="game-info">
      <h3 class="game-title">{{ game.title }}</h3>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['play'])

const playGame = () => {
  emit('play', props.game.addressBar)
}
</script>

<style scoped>
.game-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #a8edea, #fed6e3, #ffecd2, #fcb69f);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.game-image {
  aspect-ratio: 1/1;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(168, 237, 234, 0.2), rgba(254, 214, 227, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .image-overlay {
  opacity: 1;
}

.game-info {
  padding: 5px 10px;
}

.game-title {
  font-size: 12px;
  color: #2d3748;
  margin: 0;
  line-height: 1.2;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .game-info {
    padding: 12px 16px 16px;
  }

  .game-title {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .game-info {
    padding: 10px;
  }

  .game-title {
    font-size: 12px;
  }
}
</style> 