<script setup lang="ts">
import { computed } from 'vue';
import { NODE_STATUS_OFFLINE, NODE_STATUS_ONLINE } from '@/constants';

const props = defineProps<{
  node: CNode;
  icon?: Icon;
  type?: BasicType;
  tooltip?: string;
}>();

const icon = computed<Icon>(() => {
  const { icon, node } = props;
  if (icon) return icon;
  return node.is_master ? ['fa', 'server'] : ['fa', 'tools'];
});

const type = computed<BasicType>(() => {
  const { type, node } = props;
  if (type) return type;
  switch (node.status) {
    case NODE_STATUS_ONLINE:
      return 'success';
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
  <cl-tag
    class-name="node-tag"
    :icon="icon"
    :type="type"
    :label="node.name"
    :tooltip="tooltip"
    short
    short-width="100px"
  >
    <template v-if="tooltip || $slots.tooltip" #tooltip>
      <slot name="tooltip" />
    </template>
  </cl-tag>
</template>

<style scoped></style>
