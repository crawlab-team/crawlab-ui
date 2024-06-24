<script setup lang="ts">
defineOptions({ name: 'ClTaskPriority' });
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
      color: 'var(--cl-red)',
    };
  } else if (priority <= 4) {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-orange)',
    };
  } else if (priority <= 6) {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-lime-green)',
    };
  } else if (priority <= 8) {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-cyan)',
    };
  } else {
    return {
      label: getPriorityLabel(priority),
      color: 'var(--cl-blue)',
    };
  }
});
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

<style lang="scss" scoped></style>
