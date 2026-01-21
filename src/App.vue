// file: src/App.vue
<template>
  <div id="app">
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
.app-footer {
  background-color: var(--bg);
  color: var(--text);
  border-top: 1px solid var(--border);
}
</style>
// file: src/App.vue
