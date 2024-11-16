<script setup lang="ts">
import { readonly } from 'vue';
import { translate } from '@/utils';
import type {
  ContextMenuItem,
  ContextMenuProps,
} from '@/components/ui/context-menu/types';

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
defineOptions({ name: 'ClFileEditorNavTabsContextMenu' });
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
