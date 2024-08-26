<script setup lang="ts">
import { computed, provide, StyleValue } from 'vue';
import { Placement } from '@popperjs/core';
import { TooltipTriggerType } from 'element-plus/es/components/tooltip/src/trigger';

interface ContextMenuProps {
  trigger?: TooltipTriggerType;
  visible?: boolean;
  placement?: Placement;
  style?: StyleValue;
}

const props = withDefaults(defineProps<ContextMenuProps>(), {
  placement: 'right-start',
});

provide('context-menu', {
  visible: computed(() => props.visible),
});

defineOptions({ name: 'ClContextMenu' });
</script>

<template>
  <el-popover
    :trigger="trigger"
    :placement="placement"
    :show-arrow="false"
    :visible="visible"
    transition="0"
    popper-class="context-menu"
  >
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #reference>
      <div :style="style">
        <slot name="reference"></slot>
      </div>
    </template>
  </el-popover>
</template>

<style lang="scss">
.context-menu {
  padding: 0 !important;
}
</style>
