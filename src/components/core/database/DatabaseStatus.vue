<script setup lang="ts">
import { computed } from 'vue';
import {
  DATABASE_STATUS_OFFLINE,
  DATABASE_STATUS_ONLINE,
} from '@/constants/database';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    status?: DatabaseStatus;
    error?: string;
    size?: BasicSize;
  }>(),
  {
    status: DATABASE_STATUS_ONLINE,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const data = computed<TagProps>(() => {
  const { status, error } = props;
  switch (status) {
    case DATABASE_STATUS_ONLINE:
      return {
        label: t('components.database.status.label.online'),
        tooltip: t('components.database.status.tooltip.online'),
        type: 'success',
        icon: ['fa', 'check'],
      };
    case DATABASE_STATUS_OFFLINE:
      return {
        label: t('components.database.status.label.offline'),
        tooltip: `${t('components.database.status.tooltip.offline')}<br><span style="color: #f56c6c">${error}</span>`,
        type: 'danger',
        icon: ['fa', 'times'],
      };
    default:
      return {
        label: t('components.database.status.label.unknown'),
        tooltip: t('components.database.status.tooltip.unknown'),
        type: 'info',
        icon: ['fa', 'question'],
      };
  }
});
defineOptions({ name: 'ClDatabaseStatus' });
</script>

<template>
  <div class="database-status">
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
  </div>
</template>

<style scoped>
.database-status {
  margin-right: 10px;
}
</style>
