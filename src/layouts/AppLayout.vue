/* file: src/layouts/AppLayout.vue */
<template>
  <div class="layout">
    <aside class="sidebar hidden-mobile">
      <nav-bar />
    </aside>

    <main class="main-content">
      <RouterView />
    </main>

    <nav class="bottom-nav">
      <nav-bar />
    </nav>
  </div>
</template>

<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
}

.sidebar {
  width: 240px;
  border-right: 1px solid var(--border);
  padding: 1rem;
}

.main-content {
  flex: 1;
  padding: 1.5rem 5vw;
  overflow-y: auto;
}

/* Barra inferior móvil */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--bg);
  border-top: 1px solid var(--border);
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>
/* file: src/layouts/AppLayout.vue */
