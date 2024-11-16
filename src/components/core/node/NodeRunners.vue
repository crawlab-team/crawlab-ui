<script setup lang="ts">
import { computed } from 'vue';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    available?: number;
    max?: number;
    size?: BasicSize;
  }>(),
  {
    size: 'default',
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const running = computed<number>(() => {
  const { available, max } = props;
  if (
    available === undefined ||
    max === undefined ||
    isNaN(available) ||
    isNaN(max)
  ) {
    return 0;
  }
  return (max - available) as number;
});

const label = computed<string>(() => {
  const { max } = props;
  return `${running.value} / ${max}`;
});

const data = computed<TagProps>(() => {
  const max = props.max as number;
  if (running.value === max) {
    return {
      label: label.value,
      tooltip: t('components.node.nodeRunners.tooltip.unavailable'),
      type: 'danger',
      icon: ['fa', 'ban'],
    };
  } else if (running.value > 0) {
    return {
      label: label.value,
      tooltip: t('components.node.nodeRunners.tooltip.running', {
        running: running.value,
        max,
      }),
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
