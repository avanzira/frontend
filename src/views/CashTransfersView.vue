<template>
  <div class="page container column">
    <FeaturePlaceholder
      :title="$t('documents.cash.title')"
      :description="$t('placeholders.cashTransfers')"
    />
  </div>
</template>

<script setup lang="ts">
import FeaturePlaceholder from "../components/FeaturePlaceholder.vue";
</script>

<style scoped>
.page {
  gap: 1.5rem;
}
</style>
