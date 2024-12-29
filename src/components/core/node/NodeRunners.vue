<script setup lang="ts">
import { computed } from 'vue';
import { translate } from '@/utils';
import { TagProps } from '@/components/ui/tag/types';
import { NODE_STATUS_OFFLINE } from '@/constants';

const props = withDefaults(
  defineProps<{
    current?: number;
    max?: number;
    size?: BasicSize;
    status?: NodeStatus;
  }>(),
  {
    current: 0,
    max: 0,
    size: 'default',
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const label = computed<string>(() => {
  const { current, max } = props;
  if (max === 0) {
    return `${current} / ∞`;
  }
  return `${current} / ${max}`;
});

const data = computed<TagProps>(() => {
  const { current, max, status } = props;
  if (status === NODE_STATUS_OFFLINE) {
    return {
      label: t('components.metric.noData.label'),
      tooltip: t('components.node.nodeStatus.tooltip.offline'),
      type: 'info',
      icon: ['fa', 'times-circle'],
    };
  }
  if (max > 0 && current >= max) {
    return {
      label: label.value,
      tooltip: t('components.node.nodeRunners.tooltip.unavailable'),
      type: 'danger',
      icon: ['fa', 'ban'],
    };
  } else if (0 < current) {
    return {
      label: label.value,
      tooltip: t('components.node.nodeRunners.tooltip.running'),
      type: 'warning',
      icon: ['far', 'check-square'],
    };
  } else {
    return {
      label: label.value,
      tooltip: t('components.node.nodeRunners.tooltip.available'),
      type: 'success',
      icon: ['far', 'check-square'],
    };
  }
});
defineOptions({ name: 'ClNodeRunners' });
</script>

<template>
  <cl-tag
    :key="data"
    :icon="data.icon"
    :label="data.label"
    :size="size"
    :spinning="data.spinning"
    :tooltip="data.tooltip"
    :type="data.type"
    @click="emit('click')"
  />
</template>

<style scoped>
.node-runners {
  cursor: pointer;

  .icon {
    margin-right: 5px;
  }
}
</style>
