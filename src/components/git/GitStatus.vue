<script setup lang="ts">
import { computed } from 'vue';
import {
  GIT_STATUS_PENDING,
  GIT_STATUS_READY,
  GIT_STATUS_ERROR,
  GIT_STATUS_CLONING,
} from '@/constants/git';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  status: GitStatus;
  size?: BasicSize;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'click', _: void): void;
}>();

const { t } = useI18n();

const data = computed<TagData>(() => {
  const { status, error } = props;
  switch (status) {
    case GIT_STATUS_PENDING:
      return {
        label: t('components.git.status.label.pending'),
        tooltip: t('components.git.status.tooltip.pending'),
        type: '',
        icon: ['fa', 'hourglass-start'],
        spinning: true,
      };
    case GIT_STATUS_CLONING:
      return {
        label: t('components.git.status.label.cloning'),
        tooltip: t('components.git.status.tooltip.cloning'),
        type: 'warning',
        icon: ['fa', 'spinner'],
        spinning: true,
      };
    case GIT_STATUS_READY:
      return {
        label: t('components.git.status.label.ready'),
        tooltip: t('components.git.status.tooltip.ready'),
        type: 'success',
        icon: ['fa', 'check'],
      };
    case GIT_STATUS_ERROR:
      return {
        label: t('components.git.status.label.error'),
        tooltip: `${t('components.git.status.tooltip.error')}<br><span style="color: 'var(--cl-red)">${error}</span>`,
        type: 'danger',
        icon: ['fa', 'times'],
      };
    default:
      return {
        label: t('components.git.status.label.unknown'),
        tooltip: t('components.git.status.tooltip.unknown'),
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
    :tooltip="data.tooltip"
    :type="data.type"
    @click="emit('click')"
  >
    <template #tooltip>
      <div v-html="data.tooltip" />
    </template>
  </cl-tag>
</template>

<style lang="scss" scoped></style>
