<script setup lang="ts">
import { translate } from '@/utils';
import useRequest from '@/services/request';
import { useNotificationAlertDetail } from '@/views';

const { get } = useRequest();

const t = translate;

const ns = 'notificationAlert';

const { activeId } = useNotificationAlertDetail();

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
