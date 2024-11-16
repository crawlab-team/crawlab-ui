<script setup lang="ts">
defineOptions({ name: 'ClSpiderDetailTabOverview' });
</script>

<template>
  <div class="spider-detail-tab-overview">
    <!-- Spider Form (handled by store) -->
    <cl-spider-form />
    <!-- ./Spider Form -->
  </div>
</template>

<style scoped>
.spider-detail-tab-overview {
  margin: 20px;
}
</style>
