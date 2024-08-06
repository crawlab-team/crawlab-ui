<script setup lang="ts">
defineOptions({ name: 'ClGitDetailTabSpiders' });
</script>

<template>
  <cl-detail-tab-list filter-key="git_id" ns="spider" />
  <cl-spider-list no-actions embedded />
</template>
