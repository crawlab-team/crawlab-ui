<script setup lang="ts">
defineOptions({ name: 'ClGitStatus' });
import { computed } from 'vue';
import { useStore } from 'vuex';
import {
  GIT_STATUS_PENDING,
  GIT_STATUS_READY,
  GIT_STATUS_ERROR,
  GIT_STATUS_CLONING,
} from '@/constants/git';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  id?: string;
  status?: GitStatus;
  size?: BasicSize;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'retry'): void;
}>();

const { t } = useI18n();

const ns = 'git';
const store = useStore();

const data = computed(() => {
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

const onRetry = async () => {
  const { id } = props;
  await store.dispatch(`${ns}/cloneGit`, { id });
  emit('retry');
};
</script>

<template>
  <div class="git-status">
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
    <cl-tag
      v-if="status === GIT_STATUS_ERROR"
      type="warning"
      :icon="['fa', 'redo']"
      :size="size"
      :tooltip="t('components.git.actions.tooltip.retry')"
      clickable
      @click="onRetry"
    />
  </div>
</template>

<style lang="scss" scoped>
.git-status {
  margin-right: 10px;
}
</style>
<style scoped>
.git-status:deep(.el-tag:not(:last-child)) {
  margin-right: 5px;
}
</style>
