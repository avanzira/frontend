<template>
  <div class="reports container column">
    <SectionTitle :level="1" align="center">
      {{ $t("reports.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("reports.subtitle") }}</p>

    <LandingGrid>
      <RouterLink class="tile-link" to="/app/reports">
        <IconTile icon="🧾">
          <template #title>{{ $t("reports.purchase.title") }}</template>
          <template #desc>{{ $t("reports.subtitle") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/reports">
        <IconTile icon="🧾">
          <template #title>{{ $t("reports.sales.title") }}</template>
          <template #desc>{{ $t("reports.subtitle") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/reports">
        <IconTile icon="💸">
          <template #title>{{ $t("reports.cash.title") }}</template>
          <template #desc>{{ $t("reports.subtitle") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/reports">
        <IconTile icon="📦">
          <template #title>{{ $t("reports.stock.title") }}</template>
          <template #desc>{{ $t("reports.subtitle") }}</template>
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
.reports {
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
