<script setup lang="ts">
import { computed, inject } from 'vue';
import { translate } from '@/utils';
import type {
  ContextMenuItem,
  ContextMenuProps,
  FileEditorContextMenuItemVisibleFn,
} from '@/components/ui/context-menu/types';

const props = withDefaults(defineProps<ContextMenuProps>(), {
  placement: 'right-start',
});

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'new-file'): void;
  (e: 'new-directory'): void;
  (e: 'upload-files'): void;
  (e: 'rename'): void;
  (e: 'clone'): void;
  (e: 'delete'): void;
  (e: 'create-spider'): void;
  (e: 'delete-spider'): void;
}>();

const t = translate;

const contextMenuItemVisibleFn = inject<FileEditorContextMenuItemVisibleFn>(
  'context-menu-item-visible-fn'
);

const items = computed<ContextMenuItem[]>(() => {
  const { activeItem } = props;
  return (
    [
      {
        title: t('components.file.editor.navMenu.createSpider'),
        icon: ['fa', 'spider'],
        className: 'create-spider',
        action: () => emit('create-spider'),
      },
      {
        title: t('components.file.editor.navMenu.newFile'),
        icon: ['fa', 'file-alt'],
        className: 'new-file',
        action: () => emit('new-file'),
      },
      {
        title: t('components.file.editor.navMenu.newDirectory'),
        icon: ['fa', 'folder-plus'],
        className: 'new-directory',
        action: () => emit('new-directory'),
      },
      {
        title: t('components.file.editor.navMenu.uploadFiles'),
        icon: ['fa', 'upload'],
        className: ['upload-files', !activeItem?.is_dir ? 'hidden' : ''].join(
          ' '
        ),
        action: () => emit('upload-files'),
      },
      {
        title: t('components.file.editor.navMenu.rename'),
        icon: ['fa', 'edit'],
        className: 'rename',
        action: () => emit('rename'),
      },
      {
        title: t('components.file.editor.navMenu.duplicate'),
        icon: ['fa', 'clone'],
        className: 'clone',
        action: () => emit('clone'),
      },
      {
        title: t('components.file.editor.navMenu.delete'),
        icon: ['fa', 'trash'],
        className: 'delete',
        action: () => emit('delete'),
      },
      {
        title: t('components.file.editor.navMenu.deleteSpider'),
        icon: ['fa', 'trash'],
        className: 'delete-spider',
        action: () => emit('delete-spider'),
      },
    ] as ContextMenuItem[]
  ).filter(item =>
    contextMenuItemVisibleFn ? contextMenuItemVisibleFn(item, activeItem) : true
  );
});

defineOptions({ name: 'ClFileEditorNavMenuContextMenu' });
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
