<script setup lang="tsx">
import { computed, ref } from 'vue';
import {
  GIT_STATUS_PENDING,
  GIT_STATUS_READY,
  GIT_STATUS_ERROR,
  GIT_STATUS_CLONING,
  GIT_STATUS_PULLING,
  GIT_STATUS_PUSHING,
} from '@/constants/git';
import { getIconByAction, translate } from '@/utils';
import type { TagProps } from '@/components/ui/tag/types';
import { ACTION_RETRY, ACTION_VIEW_LOGS } from '@/constants';
import type { ContextMenuItem } from '@/components/ui/context-menu/types';

const props = defineProps<{
  id?: string;
  status?: GitStatus;
  size?: BasicSize;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'view-logs'): void;
  (e: 'retry'): void;
}>();

const t = translate;

const data = computed<TagProps>(() => {
  const { status, error } = props;
  switch (status) {
    case GIT_STATUS_PENDING:
      return {
        label: t('components.git.status.label.pending'),
        tooltip: t('components.git.status.tooltip.pending'),
        type: 'primary',
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

const contextMenuVisible = ref(false);
const contextMenuItems = computed<ContextMenuItem[]>(() => {
  const items: ContextMenuItem[] = [];
  items.push({
    title: t('common.actions.viewLogs'),
    icon: getIconByAction(ACTION_VIEW_LOGS),
    action: () => {
      emit('view-logs');
      contextMenuVisible.value = false;
    },
  });
  if (props.status === GIT_STATUS_ERROR) {
    items.push({
      title: t('common.actions.retry'),
      icon: getIconByAction(ACTION_RETRY),
      action: () => {
        emit('retry');
        contextMenuVisible.value = false;
      },
    });
  }
  return items;
});

const onClick = () => {
  if (props.status === GIT_STATUS_ERROR) {
    contextMenuVisible.value = !contextMenuVisible.value;
    return;
  }
  emit('view-logs');
};

defineOptions({ name: 'ClGitStatus' });
</script>

<template>
  <cl-context-menu :visible="contextMenuVisible">
    <template #reference>
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
          @click="onClick"
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
    <cl-context-menu-list
      :items="contextMenuItems"
      @hide="contextMenuVisible = false"
    />
  </cl-context-menu>
</template>

<style scoped>
.git-status {
  margin-right: 10px;

  &:deep(.el-tag:not(:last-child)) {
    margin-right: 5px;
  }
}
</style>
