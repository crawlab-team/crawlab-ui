<script setup lang="ts">
import { computed } from 'vue';
import { NODE_STATUS_OFFLINE, NODE_STATUS_ONLINE } from '@/constants/node';
import { translate } from '@/utils';
import { TagProps } from '@/components/ui/tag/types';

const props = defineProps<{
  status: NodeStatus;
  size?: BasicSize;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const data = computed<TagProps>(() => {
  const { status } = props;
  switch (status) {
    case NODE_STATUS_ONLINE:
      return {
        label: t('components.node.nodeStatus.label.online'),
        tooltip: t('components.node.nodeStatus.tooltip.online'),
        type: 'success',
        icon: ['fa', 'check'],
      };
    case NODE_STATUS_OFFLINE:
      return {
        label: t('components.node.nodeStatus.label.offline'),
        tooltip: t('components.node.nodeStatus.tooltip.offline'),
        type: 'info',
        icon: ['fa', 'times'],
      };
    default:
      return {
        label: t('components.node.nodeStatus.label.unknown'),
        tooltip: t('components.node.nodeStatus.tooltip.unknown'),
        type: 'info',
        icon: ['fa', 'question'],
      };
  }
});
defineOptions({ name: 'ClNodeStatus' });
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
  />
</template>
