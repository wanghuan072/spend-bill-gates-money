<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 确保页面内容能够撑满整个视口高度 */
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
