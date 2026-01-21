<template>
  <div class="icon-tile">
    <div class="icon-box">
      <div class="icon">{{ icon }}</div>
    </div>
    <div class="text-box">
      <h3 class="title"><slot name="title" /></h3>
      <p class="desc"><slot name="desc" /></p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>

<style scoped>
.icon-tile {
  display: grid;
  grid-template-columns: 7vh minmax(35vw, 1fr);
  align-items: center;
  column-gap: 1.6vw;
  padding: 1.2vh 0;
  width: 100%;
  max-width: clamp(40vw, 60vw, 80vw);
  margin: 0 auto;
}

.icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 5vh;
  height: 5vh;
  border-radius: 1.2vh;
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4vh;
}

.text-box {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  align-items: flex-start;
  min-width: 35vw;
}

.title {
  margin: 0;
  font-size: clamp(1.05rem, 2.2vh, 1.4rem);
}

.desc {
  margin: 0;
  color: var(--muted);
  font-size: clamp(0.9rem, 1.8vh, 1.05rem);
}
</style>
