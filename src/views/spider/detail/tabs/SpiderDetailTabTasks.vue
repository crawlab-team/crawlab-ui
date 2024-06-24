<script setup lang="ts">
defineOptions({ name: 'ClSpiderDetailTabTasks' });
</script>

<template>
  <cl-detail-tab-list filter-key="spider_id" ns="task">
    <cl-task-list no-actions embedded />
  </cl-detail-tab-list>
</template>
