<template>
  <div class="landing container column">
    <SectionTitle :level="1" align="center">
      {{ $t("landing.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("landing.subtitle") }}</p>

    <LandingGrid>
      <RouterLink class="tile-link" to="/app/entities">
        <IconTile icon="🧩">
          <template #title>{{ $t("landing.entities.title") }}</template>
          <template #desc>{{ $t("landing.entities.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/documents">
        <IconTile icon="🧾">
          <template #title>{{ $t("landing.documents.title") }}</template>
          <template #desc>{{ $t("landing.documents.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/reports">
        <IconTile icon="📊">
          <template #title>{{ $t("landing.reports.title") }}</template>
          <template #desc>{{ $t("landing.reports.desc") }}</template>
        </IconTile>
      </RouterLink>
    </LandingGrid>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import IconTile from "../components/IconTile.vue";
import LandingGrid from "../components/LandingGrid.vue";
import SectionTitle from "../components/SectionTitle.vue";
</script>

<style scoped>
.landing {
  gap: 1.2vh;
  align-items: center;
}

.lead {
  text-align: center;
  color: var(--muted);
  margin: 0 0 1vh;
}

.tile-link {
  text-decoration: none;
  color: inherit;
}
</style>
