<template>
  <div class="landing container column">
    <SectionTitle :level="1" align="center">
      {{ $t("documents.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("documents.subtitle") }}</p>

    <LandingGrid>
      <RouterLink class="tile-link" to="/app/documents/purchase-notes">
        <IconTile icon="🧾">
          <template #title>{{ $t("documents.purchase.title") }}</template>
          <template #desc>{{ $t("documents.purchase.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/documents/sales-notes">
        <IconTile icon="🧾">
          <template #title>{{ $t("documents.sales.title") }}</template>
          <template #desc>{{ $t("documents.sales.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/documents/stock-deposits">
        <IconTile icon="📦">
          <template #title>{{ $t("documents.stock.title") }}</template>
          <template #desc>{{ $t("documents.stock.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/documents/cash-transfers">
        <IconTile icon="💸">
          <template #title>{{ $t("documents.cash.title") }}</template>
          <template #desc>{{ $t("documents.cash.desc") }}</template>
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
