<script setup lang="ts">
defineOptions({ name: 'ClDataSourceStatus' });
import { computed } from 'vue';
import {
  DATA_SOURCE_STATUS_OFFLINE,
  DATA_SOURCE_STATUS_ONLINE,
} from '@/constants/ds';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    status?: DataSourceStatus;
    error?: string;
    size: BasicSize;
  }>(),
  {
    status: DATA_SOURCE_STATUS_ONLINE,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const { t } = useI18n();

const data = computed<TagProps>(() => {
  const { status, error } = props;
  switch (status) {
    case DATA_SOURCE_STATUS_ONLINE:
      return {
        label: t('components.ds.status.label.online'),
        tooltip: t('components.ds.status.tooltip.online'),
        type: 'success',
        icon: ['fa', 'check'],
      };
    case DATA_SOURCE_STATUS_OFFLINE:
      return {
        label: t('components.ds.status.label.offline'),
        tooltip: `${t('components.ds.status.tooltip.offline')}<br><span style="color: #f56c6c">${error}</span>`,
        type: 'danger',
        icon: ['fa', 'times'],
      };
    default:
      return {
        label: t('components.ds.status.label.unknown'),
        tooltip: t('components.ds.status.tooltip.unknown'),
        type: 'info',
        icon: ['fa', 'question'],
      };
  }
});
</script>

<template>
  <cl-tag
    :key="data"
    :icon="data.icon"
    :label="data.label"
    :size="size"
    :spinning="data.spinning"
    :type="data.type"
    @click="emit('click')"
  >
    <template #tooltip>
      <div v-html="data.tooltip" />
    </template>
  </cl-tag>
</template>

<style lang="scss" scoped>
.task-status {
  width: 80px;
  cursor: default;

  .icon {
    width: 10px;
    margin-right: 5px;
  }
}
</style>
