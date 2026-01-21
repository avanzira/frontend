<template>
  <section class="placeholder">
    <SectionTitle :level="2">{{ title }}</SectionTitle>
    <p class="text">{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
import SectionTitle from "./SectionTitle.vue";

defineProps<{
  title: string;
  description: string;
}>();
</script>

<style scoped>
.placeholder {
  text-align: center;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2.2vh 3vw;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.text {
  color: var(--muted);
  margin: 0;
}
</style>
