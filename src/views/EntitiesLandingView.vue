<template>
  <div class="landing container column">
    <SectionTitle :level="1" align="center">
      {{ $t("entities.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("entities.subtitle") }}</p>

    <LandingGrid>
      <RouterLink class="card-link" to="/app/entities/users">
        <BaseCard>
          <h3>{{ $t("entities.users.title") }}</h3>
          <p>{{ $t("entities.users.desc") }}</p>
          <BaseButton variant="ghost">{{ $t("landing.cta") }}</BaseButton>
        </BaseCard>
      </RouterLink>
      <RouterLink class="card-link" to="/app/entities/products">
        <BaseCard>
          <h3>{{ $t("entities.products.title") }}</h3>
          <p>{{ $t("entities.products.desc") }}</p>
          <BaseButton variant="ghost">{{ $t("landing.cta") }}</BaseButton>
        </BaseCard>
      </RouterLink>
      <RouterLink class="card-link" to="/app/entities/customers">
        <BaseCard>
          <h3>{{ $t("entities.customers.title") }}</h3>
          <p>{{ $t("entities.customers.desc") }}</p>
          <BaseButton variant="ghost">{{ $t("landing.cta") }}</BaseButton>
        </BaseCard>
      </RouterLink>
      <RouterLink class="card-link" to="/app/entities/suppliers">
        <BaseCard>
          <h3>{{ $t("entities.suppliers.title") }}</h3>
          <p>{{ $t("entities.suppliers.desc") }}</p>
          <BaseButton variant="ghost">{{ $t("landing.cta") }}</BaseButton>
        </BaseCard>
      </RouterLink>
    </LandingGrid>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import BaseButton from "../components/BaseButton.vue";
import BaseCard from "../components/BaseCard.vue";
import LandingGrid from "../components/LandingGrid.vue";
import SectionTitle from "../components/SectionTitle.vue";
</script>

<style scoped>
.landing {
  gap: 1.5rem;
}

.lead {
  text-align: center;
  color: var(--muted);
  margin: 0 0 1rem;
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.card-link :deep(.base-card) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-link:hover :deep(.base-card) {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
}

h3 {
  margin: 0 0 0.5rem;
}
</style>
