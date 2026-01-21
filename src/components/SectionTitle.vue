<template>
  <component :is="tag" class="section-title" :class="`align-${align}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3;
    align?: "left" | "center" | "right";
  }>(),
  {
    level: 2,
    align: "left",
  }
);

const tag = computed(() => `h${props.level}`);
</script>

<style scoped>
.section-title {
  margin: 0 0 1rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}
</style>
