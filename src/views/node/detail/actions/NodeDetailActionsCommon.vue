<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { isPro, translate } from '@/utils';
import useRequest from '@/services/request';
import useDetail from '@/layouts/content/detail/useDetail';
import { formatBytes } from '@/utils/metric';

const { get } = useRequest();

const t = translate;

const ns = 'node';

const { activeId } = useDetail<CNode>(ns);

const currentMetricsData = ref<Metric>();
const getCurrentMetricsData = async () => {
  const res = await get(`/nodes/${activeId.value}/metrics/current`);
  currentMetricsData.value = res.data;
};

const getTagType = (percent?: number) => {
  if (percent === undefined) return 'default';
  if (percent < 30) return 'success';
  if (percent < 70) return 'primary';
  if (percent < 90) return 'warning';
  return 'danger';
};

let handle: number;
onBeforeMount(getCurrentMetricsData);
onBeforeMount(() => {
  handle = setInterval(getCurrentMetricsData, 60 * 1000);
});
onBeforeUnmount(() => {
  clearInterval(handle);
});
watch(activeId, getCurrentMetricsData);

defineOptions({ name: 'ClNodeDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group v-if="isPro()">
    <cl-nav-action-fa-icon :icon="['fa', 'tachometer-alt']" />
    <template v-if="currentMetricsData">
      <cl-nav-action-item>
        <cl-tag
          size="large"
          :icon="['fa', 'microchip']"
          :type="getTagType(currentMetricsData?.cpu_usage_percent)"
          :label="Math.round(currentMetricsData?.cpu_usage_percent) + '%'"
        >
          <template #tooltip>
            <div>
              <label>
                {{ t('components.node.metric.metrics.cpu_usage_percent') }}:
              </label>
              <span
                :style="{
                  color: `var(--cl-${getTagType(currentMetricsData?.cpu_usage_percent)}-color)`,
                }"
              >
                {{ Math.round(currentMetricsData?.cpu_usage_percent) }}%
              </span>
            </div>
          </template>
        </cl-tag>
      </cl-nav-action-item>
      <cl-nav-action-item>
        <cl-tag
          size="large"
          :icon="['fa', 'memory']"
          :type="getTagType(currentMetricsData?.used_memory_percent)"
          :label="`${formatBytes(currentMetricsData?.used_memory)} / ${formatBytes(currentMetricsData?.total_memory)} (${Math.round(currentMetricsData?.used_memory_percent)}%)`"
        >
          <template #tooltip>
            <div>
              <label>
                {{ t('components.node.metric.metrics.used_memory') }}:
              </label>
              <span
                :style="{
                  color: `var(--cl-${getTagType(currentMetricsData?.used_memory_percent)}-color)`,
                }"
              >
                {{ formatBytes(currentMetricsData?.used_memory) }} ({{
                  Math.round(currentMetricsData?.used_memory_percent)
                }}%)
              </span>
            </div>
            <div>
              <label>
                {{ t('components.node.metric.metrics.total_memory') }}:
              </label>
              <span>
                {{ formatBytes(currentMetricsData?.total_memory) }}
              </span>
            </div>
          </template>
        </cl-tag>
      </cl-nav-action-item>
      <cl-nav-action-item>
        <cl-tag
          size="large"
          :icon="['fa', 'hdd']"
          :type="getTagType(currentMetricsData?.used_disk_percent)"
          :label="`${formatBytes(currentMetricsData?.used_disk)} / ${formatBytes(currentMetricsData?.total_disk)} (${Math.round(currentMetricsData?.used_disk_percent)}%)`"
        >
          <template #tooltip>
            <div>
              <label>
                {{ t('components.node.metric.metrics.used_disk') }}:
              </label>
              <span
                :style="{
                  color: `var(--cl-${getTagType(currentMetricsData?.used_disk_percent)}-color)`,
                }"
              >
                {{ formatBytes(currentMetricsData?.used_disk) }} ({{
                  Math.round(currentMetricsData?.used_disk_percent)
                }}%)
              </span>
            </div>
            <div>
              <label>
                {{ t('components.node.metric.metrics.total_disk') }}:
              </label>
              <span>
                {{ formatBytes(currentMetricsData?.total_disk) }}
              </span>
            </div>
          </template>
        </cl-tag>
      </cl-nav-action-item>
    </template>
    <template v-else>
      <cl-nav-action-item>
        <cl-tag
          size="large"
          type="info"
          :icon="['fa', 'times-circle']"
          :label="t('components.node.metric.noData.label')"
          :tooltip="t('components.node.metric.noData.tooltip')"
        />
      </cl-nav-action-item>
    </template>
  </cl-nav-action-group>
</template>

<style scoped>
.nav-action-group:deep(.tag) {
  margin-right: 10px;
}
</style>
