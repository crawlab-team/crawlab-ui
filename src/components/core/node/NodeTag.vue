<script setup lang="ts">
import { computed } from 'vue';
import { NODE_STATUS_OFFLINE, NODE_STATUS_ONLINE } from '@/constants';
import { translate } from '@/utils';

const t = translate;

const props = defineProps<{
  node: CNode;
  icon?: Icon;
  size?: BasicSize;
  type?: BasicType;
  tooltip?: string;
  clickable?: boolean;
  loading?: boolean;
  effect?: BasicEffect;
  hit?: boolean;
  iconOnly?: boolean;
  noLabel?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'mouseenter'): void;
  (e: 'mouseleave'): void;
}>();

const slots = defineSlots<{
  tooltip: any;
  'extra-items': any;
}>();

const icon = computed<Icon>(() => {
  const { icon, loading, node } = props;
  if (icon) return icon;
  if (loading) return ['fa', 'spinner'];
  return node.is_master ? ['fa', 'server'] : ['fa', 'tools'];
});

const type = computed<BasicType>(() => {
  const { type, node } = props;
  if (type) return type;
  switch (node.status) {
    case NODE_STATUS_ONLINE:
      return 'primary';
    case NODE_STATUS_OFFLINE:
      return 'info';
  }
  return 'primary';
});

const tooltip = computed<string>(() => {
  const { tooltip } = props;
  if (tooltip) return tooltip;
  return props.node.name!;
});

defineOptions({ name: 'ClNodeTag' });
</script>

<template>
  <cl-icon
    v-if="iconOnly"
    :icon="icon"
    :size="size"
    :color="
      type === 'primary' ? 'var(--cl-primary-color)' : 'var(--cl-warning-color)'
    "
    :spinning="loading"
  />
  <cl-tag
    v-else
    class-name="node-tag"
    :icon="icon"
    :size="size"
    :spinning="loading"
    :type="type"
    :label="!noLabel && node.name"
    :tooltip="tooltip"
    :clickable="clickable"
    :effect="effect"
    :hit="hit"
    max-width="150px"
    short
    @click="emit('click')"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
  >
    <template v-if="slots.tooltip" #tooltip>
      <slot name="tooltip" />
    </template>
    <template v-else #tooltip>
      <div class="tooltip-wrapper">
        <div class="tooltip-title">
          {{ t('layouts.routes.nodes.detail.title') }}
        </div>
        <div class="tooltip-item">
          <label>{{ t('components.node.form.name') }}:</label>
          <span>{{ node.name }}</span>
        </div>
        <div class="tooltip-item">
          <label>{{ t('components.node.form.type') }}:</label>
          <span v-if="node.is_master" style="color: var(--cl-primary-color)">
            {{ t('components.node.nodeType.label.master') }}
          </span>
          <span v-else style="color: var(--cl-warning-color)">
            {{ t('components.node.nodeType.label.worker') }}
          </span>
        </div>
        <div class="tooltip-item">
          <label>{{ t('components.node.form.status') }}:</label>
          <span
            v-if="node.status === NODE_STATUS_ONLINE"
            style="color: var(--cl-success-color)"
          >
            {{ t('components.node.nodeStatus.label.online') }}
          </span>
          <span v-else style="color: var(--cl-danger-color)">
            {{ t('components.node.nodeStatus.label.offline') }}
          </span>
        </div>
        <slot name="extra-items" />
      </div>
    </template>
  </cl-tag>
</template>

<style scoped>
.tooltip-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:deep(.tooltip-title) {
    font-weight: bold;
    font-style: italic;
    text-decoration: underline;
    margin-bottom: 3px;
  }

  &:deep(.tooltip-item) {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    margin-left: 10px;
    line-height: 1;
  }

  &:deep(.tooltip-item label) {
    font-weight: normal;
    margin-right: 5px;
  }
}
</style>
