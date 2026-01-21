<template>
  <div class="landing-grid">
    <slot />
  </div>
</template>

<style scoped>
.landing-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
  width: 100%;
  max-width: 80vw;
  margin: 0 auto;
  align-items: center;
}
</style>
