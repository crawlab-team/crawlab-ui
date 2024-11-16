<script setup lang="ts">
import { computed } from 'vue';
import { isCancellable } from '@/utils/task';
import { TASK_STATUS_PENDING } from '@/constants/task';
import { translate } from '@/utils';
import { TagProps } from '@/components/ui/tag/types';

const props = defineProps<{
  results?: number;
  status?: TaskStatus;
  size?: BasicSize;
  clickable?: boolean;
  onClick?: () => void;
}>();

const t = translate;

const data = computed<TagProps>(() => {
  const { results, status } = props;
  if (isCancellable(status)) {
    if (status === TASK_STATUS_PENDING) {
      return {
        label: results?.toFixed(0),
        tooltip: `${t('components.task.results.results')}: ${results}`,
        type: 'primary',
        icon: ['fa', 'hourglass-start'],
        spinning: true,
      };
    } else {
      return {
        label: results?.toFixed(0),
        tooltip: `${t('components.task.results.results')}: ${results}`,
        type: 'warning',
        icon: ['fa', 'spinner'],
        spinning: true,
      };
    }
  } else {
    if (results === 0) {
      return {
        label: results?.toFixed(0),
        tooltip: t('components.task.results.noResults'),
        type: 'danger',
        icon: ['fa', 'exclamation'],
      };
    } else {
      return {
        label: results?.toFixed(0),
        tooltip: `${t('components.task.results.results')}: ${results}`,
        type: 'success',
        icon: ['fa', 'table'],
      };
    }
  }
});
defineOptions({ name: 'ClTaskResults' });
</script>

<template>
  <cl-tag
    :key="data"
    :icon="data.icon"
    :label="data.label"
    :size="size"
    :spinning="data.spinning"
    :type="data.type"
    clas-name="task-results"
    :clickable="clickable"
    @click="onClick"
  >
    <template #tooltip>
      <div v-html="data.tooltip" />
    </template>
  </cl-tag>
</template>

<style scoped>
.task-results {
  &.clickable {
    cursor: pointer;
  }
}
</style>
