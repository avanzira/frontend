<template>
  <div class="report-table">
    <SectionTitle v-if="title" :level="3">{{ title }}</SectionTitle>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td :colspan="columns.length" class="empty">
              {{ $t("reports.empty") }}
            </td>
          </tr>
          <tr v-for="(row, idx) in rows" :key="idx">
            <td v-for="col in columns" :key="col.key">
              {{ row[col.key] ?? "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionTitle from "./SectionTitle.vue";

defineProps<{
  title?: string;
  columns: { key: string; label: string }[];
  rows: Record<string, unknown>[];
}>();
</script>

<style scoped>
.report-table {
  width: 100%;
}

.table-wrapper {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow-x: auto;
  background: var(--surface);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

th {
  font-weight: 600;
  color: var(--text);
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 1.5rem 1rem;
}
</style>
