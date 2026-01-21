/* file: src/layouts/AppLayout.vue */
<template>
  <div class="layout">
    <header class="top-nav">
      <nav-bar />
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
}

.top-nav {
  width: 100%;
  height: 7vh;
  padding: 0 3vw;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.main-content {
  flex: 1;
  padding: 1.5vh 4vw;
  overflow-y: auto;
}
</style>
/* file: src/layouts/AppLayout.vue */
