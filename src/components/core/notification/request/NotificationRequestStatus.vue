<script setup lang="ts">
import { translate } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{
  status: NotificationRequestStatus;
  size?: BasicSize;
  error?: string;
  clickable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// i18n
const t = translate;

const data = computed(() => {
  const { status, error } = props;
  switch (status) {
    case 'sending':
      return {
        label: t('components.notification.request.status.label.sending'),
        tooltip: t('components.notification.request.status.tooltip.sending'),
        type: 'warning',
        icon: ['fa', 'spinner'],
        spinning: true,
      };
    case 'success':
      return {
        label: t('components.notification.request.status.label.success'),
        tooltip: t('components.notification.request.status.tooltip.success'),
        type: 'success',
        icon: ['fa', 'check'],
      };
    case 'error':
      return {
        label: t('components.notification.request.status.label.error'),
        tooltip: `${t('components.notification.request.status.tooltip.error')}<br><span style="color: 'var(--cl-red)">${error}</span>`,
        type: 'danger',
        icon: ['fa', 'times'],
      };
    default:
      return {
        label: t('components.notification.request.status.label.unknown'),
        tooltip: t('components.notification.request.status.tooltip.unknown'),
        type: 'default',
        icon: ['fa', 'question'],
      };
  }
});
defineOptions({ name: 'ClNotificationRequestStatus' });
</script>

<template>
  <cl-tag
    class-name="notification-request-status"
    :key="data"
    :icon="data.icon"
    :label="data.label"
    :spinning="data.spinning"
    :type="data.type"
    :size="size"
    :clickable="clickable"
    @click="emit('click')"
  >
    <template #tooltip>
      <div v-html="data.tooltip" />
    </template>
  </cl-tag>
</template>

<style scoped></style>
