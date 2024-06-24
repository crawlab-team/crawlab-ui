<script setup lang="ts">
defineOptions({ name: 'ClFileEditorNavTabsShowMoreContextMenu' });
import { computed } from 'vue';
import { FileNavItem } from '@/components/file/file';

interface ContextMenuProps {
  visible?: boolean;
  placement: string;
  clicking?: boolean;
}

interface ContextMenuItem {
  title: string;
  icon?: Icon;
  action?: () => void;
  className?: string;
}

const props = defineProps<
  ContextMenuProps & {
    tabs?: FileNavItem[];
  }
>();

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'tab-click', tab: FileNavItem): void;
}>();

const items = computed<ContextMenuItem[]>(() => {
  const { tabs } = props;
  const contextMenuItems: ContextMenuItem[] =
    tabs?.map(t => {
      return {
        title: t.path || '',
        icon: t.name || '',
        action: () => emit('tab-click', t),
      };
    }) || [];
  return contextMenuItems;
});
</script>

<template>
  <cl-context-menu
    :placement="placement"
    :visible="visible"
    @hide="emit('hide')"
  >
    <template #default>
      <cl-context-menu-list :items="items" @hide="emit('hide')" />
    </template>
    <template #reference>
      <slot></slot>
    </template>
  </cl-context-menu>
</template>

<style lang="scss" scoped></style>
