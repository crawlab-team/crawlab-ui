<script setup lang="tsx">
import { computed, VNode } from 'vue';
import {
  GIT_STATUS_PENDING,
  GIT_STATUS_READY,
  GIT_STATUS_ERROR,
  GIT_STATUS_CLONING,
  GIT_STATUS_PULLING,
  GIT_STATUS_PUSHING,
} from '@/constants/git';
import { translate } from '@/utils';

const props = defineProps<{
  id?: string;
  status?: GitStatus;
  size?: BasicSize;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const data = computed<TagProps & { tooltip: VNode }>(() => {
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
        tooltip: (
          <>
            <div>{t('components.git.status.tooltip.error')}:</div>
            <div style={{ color: 'var(--cl-danger-color)' }}>{error}</div>
          </>
        ),
        type: 'danger',
        icon: ['fa', 'times'],
      };
    case GIT_STATUS_PULLING:
      return {
        label: t('components.git.status.label.pulling'),
        tooltip: t('components.git.status.tooltip.pulling'),
        type: 'warning',
        icon: ['fa', 'spinner'],
        spinning: true,
      };
    case GIT_STATUS_PUSHING:
      return {
        label: t('components.git.status.label.pushing'),
        tooltip: t('components.git.status.tooltip.pushing'),
        type: 'warning',
        icon: ['fa', 'spinner'],
        spinning: true,
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

// const onClick = async () => {
//   const { status } = props;
//   if (status === GIT_STATUS_ERROR) {
//     emit('retry');
//     // await store.dispatch(`${ns}/cloneGit`, { id });
//   } else {
//     emit('click');
//   }
// };

defineOptions({ name: 'ClGitStatus' });
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
      clickable
      @click="emit('click')"
    >
      <template
        v-if="data.tooltip && typeof data.tooltip !== 'string'"
        #tooltip
      >
        <component :is="data.tooltip" />
      </template>
    </cl-tag>
  </div>
</template>

<style scoped>
.git-status {
  margin-right: 10px;

  &:deep(.el-tag:not(:last-child)) {
    margin-right: 5px;
  }
}
</style>
