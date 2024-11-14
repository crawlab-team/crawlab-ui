<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { isPro, translate } from '@/utils';
import useRequest from '@/services/request';
import { useDetail } from '@/layouts';

const { get } = useRequest();

const ns = 'node';

const { activeId } = useDetail<CNode>(ns);

const currentMetricsData = ref<BasicMetric>();
const getCurrentMetricsData = async () => {
  const res = await get(`/nodes/${activeId.value}/metrics/current`);
  currentMetricsData.value = res.data;
};

let handle: any;
onBeforeMount(async () => {
  if (!isPro()) return;
  await getCurrentMetricsData();
  handle = setInterval(getCurrentMetricsData, 60 * 1000);
});
onBeforeUnmount(() => {
  clearInterval(handle);
});
watch(activeId, async () => {
  if (!isPro()) return;
  await getCurrentMetricsData();
});

defineOptions({ name: 'ClNodeDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group v-if="isPro()">
    <cl-nav-action-fa-icon :icon="['fa', 'tachometer-alt']" />
    <cl-nav-action-item>
      <cl-current-metrics :metric="currentMetricsData" size="large" />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped>
.nav-action-group {
  &:deep(.tag) {
    margin-right: 10px;
  }
}
</style>
