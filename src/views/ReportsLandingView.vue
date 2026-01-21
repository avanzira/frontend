<template>
  <div class="reports container column">
    <SectionTitle :level="1" align="center">
      {{ $t("reports.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("reports.subtitle") }}</p>

    <BaseCard>
      <GenericReportTable
        :title="$t('reports.purchase.title')"
        :columns="columns"
        :rows="[]"
      />
    </BaseCard>

    <BaseCard>
      <GenericReportTable
        :title="$t('reports.sales.title')"
        :columns="columns"
        :rows="[]"
      />
    </BaseCard>

    <BaseCard>
      <GenericReportTable
        :title="$t('reports.cash.title')"
        :columns="columns"
        :rows="[]"
      />
    </BaseCard>

    <BaseCard>
      <GenericReportTable
        :title="$t('reports.stock.title')"
        :columns="columns"
        :rows="[]"
      />
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseCard from "../components/BaseCard.vue";
import GenericReportTable from "../components/GenericReportTable.vue";
import SectionTitle from "../components/SectionTitle.vue";

const { t } = useI18n();

const columns = computed(() => [
  { key: "id", label: t("reports.columns.id") },
  { key: "date", label: t("reports.columns.date") },
  { key: "total", label: t("reports.columns.total") },
  { key: "status", label: t("reports.columns.status") },
]);
</script>

<style scoped>
.reports {
  gap: 1.5rem;
}

.lead {
  text-align: center;
  color: var(--muted);
  margin: 0 0 1rem;
}
</style>
