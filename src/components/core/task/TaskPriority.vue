<script setup lang="ts">
import { computed } from 'vue';
import { getPriorityLabel } from '@/utils/task';

const props = withDefaults(
  defineProps<{
    priority: number;
    size: string;
  }>(),
  {
    priority: 5,
    size: 'default',
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const data = computed<TagProps>(() => {
  const priority = props.priority as number;

  if (priority <= 2) {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-success-color)',
      type: 'success',
    };
  } else if (priority <= 4) {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-success-color)',
      type: 'success',
    };
  } else if (priority <= 6) {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-warning-color)',
      type: 'warning',
    };
  } else if (priority <= 8) {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-danger-color)',
      type: 'danger',
    };
  } else {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-danger-color)',
      type: 'danger',
    };
  }
});
defineOptions({ name: 'ClTaskPriority' });
</script>

<template>
  <cl-tag
    :key="data"
    :color="data.color"
    :icon="data.icon"
    :label="data.label"
    :size="size"
    :spinning="data.spinning"
    :tooltip="data.tooltip"
    :type="data.type"
    effect="plain"
    @click="emit('click')"
  />
</template>
