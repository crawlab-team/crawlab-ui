<script setup lang="ts">
import { computed, provide } from 'vue';
import { ContextMenuProps } from './types';

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
      <slot name="reference"></slot>
    </template>
  </el-popover>
</template>

<style>
.context-menu {
  padding: 0 !important;
}
</style>
