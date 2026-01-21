// file: src/App.vue
<template>
  <div id="app">
    <header class="app-header">
      <h1 class="text-center">{{ $t("app.title") }}</h1>
    </header>

    <main class="container">
      <RouterView />
    </main>

    <footer class="app-footer hidden-mobile">
      <small>{{ $t("app.footer", { year: new Date().getFullYear() }) }}</small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style scoped>
.app-header {
  background-color: var(--bg);
  color: var(--text);
  border-bottom: 1px solid var(--border);
}

.app-footer {
  background-color: var(--bg);
  color: var(--text);
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.2rem;
  }
}
</style>
// file: src/App.vue
