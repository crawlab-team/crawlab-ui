<script setup lang="ts">
import { isPro, translate } from '@/utils';
import useRequest from '@/services/request';
import useDetail from '@/layouts/content/detail/useDetail';

const { get } = useRequest();

const t = translate;

const ns = 'notificationChannel';

const { activeId } = useDetail<NotificationChannel>(ns);

defineOptions({ name: 'ClNotificationChannelDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group v-if="isPro()">
    <cl-nav-action-fa-icon :icon="['fa', 'tachometer-alt']" />
  </cl-nav-action-group>
</template>

<style scoped>
.nav-action-group:deep(.tag) {
  margin-right: 10px;
}
</style>
