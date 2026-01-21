<template>
  <div class="landing-grid">
    <slot />
  </div>
</template>

<style scoped>
.landing-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  width: 100%;
}
</style>
