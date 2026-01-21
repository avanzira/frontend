<template>
  <div class="landing container column">
    <SectionTitle :level="1" align="center">
      {{ $t("landing.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("landing.subtitle") }}</p>

    <LandingGrid>
      <RouterLink class="card-link" to="/app/entities">
        <BaseCard>
          <h3>{{ $t("landing.entities.title") }}</h3>
          <p>{{ $t("landing.entities.desc") }}</p>
          <BaseButton variant="ghost">{{ $t("landing.cta") }}</BaseButton>
        </BaseCard>
      </RouterLink>
      <RouterLink class="card-link" to="/app/documents">
        <BaseCard>
          <h3>{{ $t("landing.documents.title") }}</h3>
          <p>{{ $t("landing.documents.desc") }}</p>
          <BaseButton variant="ghost">{{ $t("landing.cta") }}</BaseButton>
        </BaseCard>
      </RouterLink>
      <RouterLink class="card-link" to="/app/reports">
        <BaseCard>
          <h3>{{ $t("landing.reports.title") }}</h3>
          <p>{{ $t("landing.reports.desc") }}</p>
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
