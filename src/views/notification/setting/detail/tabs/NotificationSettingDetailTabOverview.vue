<script setup lang="ts">
defineOptions({ name: 'ClNotificationSettingDetailTabOverview' });
</script>

<template>
  <div class="notification-setting-detail-tab-overview">
    <!-- Notification Form (handled by store) -->
    <cl-notification-setting-form />
    <!-- ./Notification Form -->
  </div>
</template>

<style scoped>
.notification-setting-detail-tab-overview {
  margin: 20px;
}
</style>
