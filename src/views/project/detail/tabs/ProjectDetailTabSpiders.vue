<script setup lang="ts">
defineOptions({ name: 'ClProjectDetailTabSpiders' });
</script>

<template>
  <cl-detail-tab-list filter-key="project_id" ns="spider">
    <cl-spider-list no-actions embedded />
  </cl-detail-tab-list>
</template>
