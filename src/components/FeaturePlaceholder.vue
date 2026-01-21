<template>
  <BaseCard class="placeholder">
    <SectionTitle :level="2">{{ title }}</SectionTitle>
    <p class="text">{{ description }}</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from "./BaseCard.vue";
import SectionTitle from "./SectionTitle.vue";

defineProps<{
  title: string;
  description: string;
}>();
</script>

<style scoped>
.placeholder {
  text-align: center;
}

.text {
  color: var(--muted);
  margin: 0;
}
</style>
