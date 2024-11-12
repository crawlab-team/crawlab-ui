<script setup lang="ts">
defineOptions({ name: 'ClRoleDetailTabUsers' });
</script>

<template>
  <cl-detail-tab-list filter-key="role_id" ns="user">
    <cl-user-list no-actions embedded />
  </cl-detail-tab-list>
</template>
