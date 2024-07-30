<script setup lang="ts">
import useNotificationAlertDetail from '@/views/notification/alert/detail/useNotificationAlertDetail';

useNotificationAlertDetail();

defineOptions({ name: 'ClNotificationAlertDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="notificationAlert" />
</template>
