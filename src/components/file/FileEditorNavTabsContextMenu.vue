<script setup lang="ts">
defineOptions({ name: 'ClFileEditorNavTabsContextMenu' });
import { readonly } from 'vue';
import { translate } from '@/utils';

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

withDefaults(defineProps<ContextMenuProps>(), {
  placement: 'right-start',
});

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'close'): void;
  (e: 'close-others'): void;
  (e: 'close-all'): void;
}>();

const t = translate;

const items = readonly<ContextMenuItem[]>([
  {
    title: t('components.file.editor.navTabs.close'),
    icon: ['fa', 'times'],
    action: () => emit('close'),
  },
  {
    title: t('components.file.editor.navTabs.closeOthers'),
    action: () => emit('close-others'),
  },
  {
    title: t('components.file.editor.navTabs.closeAll'),
    action: () => emit('close-all'),
  },
]);
</script>

<template>
  <cl-context-menu
    :clicking="clicking"
    :placement="placement"
    :visible="visible"
    @hide="emit('hide')"
  >
    <template #default>
      <cl-context-menu-list :items="items" @hide="emit('hide')" />
    </template>
    <template #reference>
      <slot />
    </template>
  </cl-context-menu>
</template>

<style lang="scss" scoped></style>
