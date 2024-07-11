<script setup lang="ts">
import { TAB_NAME_TEMPLATE } from '@/constants';
import useNotificationDetail from '@/views/notification/detail/useNotificationDetail';

const { activeTabName } = useNotificationDetail();
</script>

<template>
  <cl-detail-layout store-namespace="notification">
    <template #actions>
      <cl-notification-detail-actions-template
        v-if="activeTabName === TAB_NAME_TEMPLATE"
      />
    </template>
  </cl-detail-layout>
</template>

<style scoped></style>
