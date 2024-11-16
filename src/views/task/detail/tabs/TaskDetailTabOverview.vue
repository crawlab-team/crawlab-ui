<script setup lang="ts">
defineOptions({ name: 'ClTaskDetailTabOverview' });
</script>

<template>
  <div class="task-detail-tab-overview">
    <cl-task-form readonly />
  </div>
</template>

<style scoped>
.task-detail-tab-overview {
  margin: 20px;
}
</style>
