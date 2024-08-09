<script setup lang="ts">
defineOptions({ name: 'ClDatabaseDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="database">
    <template #actions>
      <cl-database-detail-actions-common />
    </template>
  </cl-detail-layout>
</template>
