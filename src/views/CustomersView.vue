<template>
  <EntityCrud resource="customers" :title="$t('entities.customers.title')" />
</template>

<script setup lang="ts">
import EntityCrud from "../components/EntityCrud.vue";
</script>
