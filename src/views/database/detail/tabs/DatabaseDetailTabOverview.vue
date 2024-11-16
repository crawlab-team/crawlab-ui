<script setup lang="ts">
defineOptions({ name: 'ClDatabaseDetailTabOverview' });
</script>

<template>
  <div class="database-detail-tab-overview">
    <cl-database-form readonly />
  </div>
</template>

<style scoped>
.database-detail-tab-overview {
  margin: 20px;
}
</style>
