<template>
  <div class="landing container column">
    <SectionTitle :level="1" align="center">
      {{ $t("entities.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("entities.subtitle") }}</p>

    <LandingGrid>
      <RouterLink v-if="isAdmin" class="tile-link" to="/app/entities/users">
        <IconTile icon="👥">
          <template #title>{{ $t("entities.users.title") }}</template>
          <template #desc>{{ $t("entities.users.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/entities/products">
        <IconTile icon="📦">
          <template #title>{{ $t("entities.products.title") }}</template>
          <template #desc>{{ $t("entities.products.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/entities/customers">
        <IconTile icon="🤝">
          <template #title>{{ $t("entities.customers.title") }}</template>
          <template #desc>{{ $t("entities.customers.desc") }}</template>
        </IconTile>
      </RouterLink>
      <RouterLink class="tile-link" to="/app/entities/suppliers">
        <IconTile icon="🏭">
          <template #title>{{ $t("entities.suppliers.title") }}</template>
          <template #desc>{{ $t("entities.suppliers.desc") }}</template>
        </IconTile>
      </RouterLink>
    </LandingGrid>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import IconTile from "../components/IconTile.vue";
import LandingGrid from "../components/LandingGrid.vue";
import SectionTitle from "../components/SectionTitle.vue";
import { useAuthStore } from "../store/auth.store";

const auth = useAuthStore();
const isAdmin = computed(() => auth.user?.rol === "ADMIN");
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
