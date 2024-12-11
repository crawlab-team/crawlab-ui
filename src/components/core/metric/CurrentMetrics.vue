<script setup lang="ts">
import { formatBytes } from '@/utils/metric';
import { translate } from '@/utils';

withDefaults(
  defineProps<{
    metric?: BasicMetric;
    size?: BasicSize;
    clickable?: boolean;
    metrics?: (
      | 'cpu_usage_percent'
      | 'used_memory_percent'
      | 'used_disk_percent'
      | 'used_memory'
      | 'used_disk'
    )[];
  }>(),
  {
    metrics: () => [
      'cpu_usage_percent',
      'used_memory_percent',
      'used_disk_percent',
    ],
  }
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const t = translate;

const getTagType = (percent?: number) => {
  if (percent === undefined) return 'default';
  if (percent < 30) return 'success';
  if (percent < 90) return 'warning';
  return 'danger';
};

defineOptions({ name: 'ClCurrentMetrics' });
</script>

<template>
  <div class="current-metrics">
    <template v-if="metric">
      <cl-tag
        v-if="metrics.includes('cpu_usage_percent')"
        :size="size"
        :clickable="clickable"
        :icon="['fa', 'microchip']"
        :type="getTagType(metric?.cpu_usage_percent)"
        :label="Math.round(metric?.cpu_usage_percent || 0) + '%'"
        @click="(event: MouseEvent) => emit('click', event)"
      >
        <template #tooltip>
          <div>
            <label>
              {{ t('components.metric.metrics.cpu_usage_percent') }}:
            </label>
            <span
              :style="{
                color: `var(--cl-${getTagType(metric?.cpu_usage_percent)}-color)`,
              }"
            >
              {{ Math.round(metric?.cpu_usage_percent || 0) }}%
            </span>
          </div>
        </template>
      </cl-tag>
      <cl-tag
        v-if="metrics.includes('used_memory_percent')"
        :size="size"
        :clickable="clickable"
        :icon="['fa', 'memory']"
        :type="getTagType(metric?.used_memory_percent)"
        :label="`${formatBytes(metric?.used_memory)} / ${formatBytes(metric?.total_memory)} (${Math.round(metric?.used_memory_percent || 0)}%)`"
        @click="(event: MouseEvent) => emit('click', event)"
      >
        <template #tooltip>
          <div>
            <label> {{ t('components.metric.metrics.used_memory') }}: </label>
            <span
              :style="{
                color: `var(--cl-${getTagType(metric?.used_memory_percent)}-color)`,
              }"
            >
              {{ formatBytes(metric?.used_memory) }} ({{
                Math.round(metric?.used_memory_percent || 0)
              }}%)
            </span>
          </div>
          <div>
            <label> {{ t('components.metric.metrics.total_memory') }}: </label>
            <span>
              {{ formatBytes(metric?.total_memory) }}
            </span>
          </div>
        </template>
      </cl-tag>
      <cl-tag
        v-if="metrics.includes('used_disk_percent')"
        :size="size"
        :clickable="clickable"
        :icon="['fa', 'hdd']"
        :type="getTagType(metric?.used_disk_percent)"
        :label="`${formatBytes(metric?.used_disk)} / ${formatBytes(metric?.total_disk)} (${Math.round(metric?.used_disk_percent || 0)}%)`"
        @click="(event: MouseEvent) => emit('click', event)"
      >
        <template #tooltip>
          <div>
            <label> {{ t('components.metric.metrics.used_disk') }}: </label>
            <span
              :style="{
                color: `var(--cl-${getTagType(metric?.used_disk_percent)}-color)`,
              }"
            >
              {{ formatBytes(metric?.used_disk) }} ({{
                Math.round(metric?.used_disk_percent || 0)
              }}%)
            </span>
          </div>
          <div>
            <label> {{ t('components.metric.metrics.total_disk') }}: </label>
            <span>
              {{ formatBytes(metric?.total_disk) }}
            </span>
          </div>
        </template>
      </cl-tag>
      <cl-tag
        v-if="metrics.includes('used_memory')"
        :size="size"
        :clickable="clickable"
        :icon="['fa', 'memory']"
        type="primary"
        :label="`${formatBytes(metric?.used_memory)}`"
        @click="(event: MouseEvent) => emit('click', event)"
      >
        <template #tooltip>
          <div>
            <label> {{ t('components.metric.metrics.used_memory') }}: </label>
            <span
              :style="{
                color: 'var(--cl-primary-color)',
              }"
            >
              {{ formatBytes(metric?.used_memory) }}
            </span>
          </div>
        </template>
      </cl-tag>
      <cl-tag
        v-if="metrics.includes('used_disk')"
        :size="size"
        :clickable="clickable"
        :icon="['fa', 'hdd']"
        type="primary"
        :label="`${formatBytes(metric?.used_disk)}`"
        @click="(event: MouseEvent) => emit('click', event)"
      >
        <template #tooltip>
          <div>
            <label> {{ t('components.metric.metrics.used_disk') }}: </label>
            <span
              :style="{
                color: 'var(--cl-primary-color)',
              }"
            >
              {{ formatBytes(metric?.used_disk) }}
            </span>
          </div>
        </template>
      </cl-tag>
    </template>
    <template v-else>
      <cl-tag
        :size="size"
        type="info"
        :icon="['fa', 'times-circle']"
        :label="t('components.metric.noData.label')"
        :tooltip="t('components.metric.noData.tooltip')"
      />
    </template>
  </div>
</template>

<style scoped>
.current-metrics {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
