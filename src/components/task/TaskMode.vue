<script setup lang="ts">
defineOptions({ name: 'ClTaskMode' });
import { computed } from 'vue';
import {
  TASK_MODE_ALL_NODES,
  TASK_MODE_RANDOM,
  TASK_MODE_SELECTED_NODES,
} from '@/constants/task';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  mode?: string;
}>();

// i18n
const { t } = useI18n();

const type = computed<string>(() => {
  const { mode } = props;
  switch (mode) {
    case TASK_MODE_RANDOM:
      return 'warning';
    case TASK_MODE_ALL_NODES:
      return 'success';
    case TASK_MODE_SELECTED_NODES:
      return 'primary';
    default:
      return 'info';
  }
});

const label = computed<string>(() => {
  const { mode } = props;
  switch (mode) {
    case TASK_MODE_RANDOM:
      return t('components.task.mode.label.randomNode');
    case TASK_MODE_ALL_NODES:
      return t('components.task.mode.label.allNodes');
    case TASK_MODE_SELECTED_NODES:
      return t('components.task.mode.label.selectedNodes');
    default:
      return t('components.task.mode.label.unknown');
  }
});

const icon = computed<string[]>(() => {
  const { mode } = props;
  switch (mode) {
    case TASK_MODE_RANDOM:
      return ['fa', 'random'];
    case TASK_MODE_ALL_NODES:
      return ['fa', 'sitemap'];
    case TASK_MODE_SELECTED_NODES:
      return ['fa', 'network-wired'];
    default:
      return ['fa', 'question'];
  }
});

const tooltip = computed<string>(() => {
  const { mode } = props;
  switch (mode) {
    case TASK_MODE_RANDOM:
      return t('components.task.mode.tooltip.randomNode');
    case TASK_MODE_ALL_NODES:
      return t('components.task.mode.tooltip.allNodes');
    case TASK_MODE_SELECTED_NODES:
      return t('components.task.mode.tooltip.selectedNodes');
    default:
      return t('components.task.mode.tooltip.unknown');
  }
});
</script>

<template>
  <cl-tag :type="type" :icon="icon" :label="label" :tooltip="tooltip" />
</template>

<style lang="scss" scoped>
.task-mode {
  min-width: 80px;
  cursor: default;

  .icon {
    width: 10px;
    margin-right: 5px;
  }
}
</style>
