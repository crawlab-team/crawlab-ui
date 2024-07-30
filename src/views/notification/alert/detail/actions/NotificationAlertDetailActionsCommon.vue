<script setup lang="ts">
import { isPro, translate } from '@/utils';
import useRequest from '@/services/request';
import useDetail from '@/layouts/content/detail/useDetail';

const { get } = useRequest();

const t = translate;

const ns = 'notificationAlert';

const { activeId } = useDetail<NotificationAlert>(ns);

defineOptions({ name: 'ClNotificationAlertDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'tachometer-alt']" />
  </cl-nav-action-group>
</template>

<style scoped>
.nav-action-group:deep(.tag) {
  margin-right: 10px;
}
</style>
