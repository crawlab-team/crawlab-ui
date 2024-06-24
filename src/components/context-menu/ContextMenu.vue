<script setup lang="ts">
defineOptions({ name: 'ClContextMenu' });
import { ClickOutside as vClickOutside } from 'element-plus';

interface ContextMenuProps {
  visible?: boolean;
  placement: string;
  clicking?: boolean;
}

const props = withDefaults(defineProps<ContextMenuProps>(), {
  placement: 'right-start',
});

export interface contextMenuEmits {
  (e: 'hide'): void;
}

const emit = defineEmits<contextMenuEmits>();

const onClickOutside = () => {
  if (props.clicking) return;
  emit('hide');
};
</script>

<template>
  <el-popover
    :placement="placement"
    :show-arrow="false"
    :visible="visible"
    popper-class="context-menu"
  >
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #reference>
      <div v-click-outside="onClickOutside">
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
