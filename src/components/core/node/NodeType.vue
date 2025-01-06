<script setup lang="ts">
import { computed } from 'vue';
import { translate } from '@/utils';

const props = defineProps<{
  isMaster?: boolean;
  label?: string;
  tooltip?: string;
  showFullLabel?: boolean;
  clickable?: boolean;
}>();

const t = translate;

const type = computed<BasicType>(() => {
  return 'primary';
});

const computedLabel = computed<string>(() => {
  const { isMaster, label } = props;
  if (label) {
    return label;
  }
  return isMaster
    ? t('components.node.nodeType.label.master')
    : t('components.node.nodeType.label.worker');
});

const icon = computed<string[]>(() => {
  const { isMaster } = props;
  return isMaster ? ['fa', 'server'] : ['fa', 'tools'];
});

const className = computed(() => {
  const { isMaster, showFullLabel } = props;
  const cls: string[] = [];
  cls.push(isMaster ? 'node-type-master' : 'node-type-worker');
  cls.push(showFullLabel ? 'node-type-full' : 'node-type-short');
  return cls.join(' ');
});

defineOptions({ name: 'ClNodeType' });
</script>

<template>
  <span class="node-type">
    <cl-tag
      :class-name="className"
      :type="type"
      :tooltip="tooltip"
      :label="computedLabel"
      :icon="icon"
      :clickable="clickable"
    >
      <template v-if="tooltip || $slots.tooltip" #tooltip>
        <slot name="tooltip" />
      </template>
    </cl-tag>
  </span>
</template>

<style scoped>
.node-type {
  &:deep(.node-type-short) {
    max-width: 120px;
    overflow: hidden;
    justify-content: start;
    align-items: center;
  }

  &:deep(.node-type-short .el-tag__content) {
    display: inline-flex;
    width: 100%;
    align-items: center;
  }

  &:deep(.node-type-short .el-tag__content .label) {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
