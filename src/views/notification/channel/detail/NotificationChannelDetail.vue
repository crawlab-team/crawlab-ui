<script setup lang="ts">
import { useStore } from 'vuex';

const ns = 'notificationChannel';
const store = useStore();

defineOptions({ name: 'ClNotificationChannelDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="notificationChannel" />
</template>
