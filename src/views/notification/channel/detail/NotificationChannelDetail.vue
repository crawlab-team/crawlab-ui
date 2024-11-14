<script setup lang="ts">
defineOptions({ name: 'ClNotificationChannelDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="notificationChannel">
    <template #actions>
      <cl-notification-channel-detail-actions-common />
    </template>
  </cl-detail-layout>
</template>
