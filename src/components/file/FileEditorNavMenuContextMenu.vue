<script setup lang="ts">
defineOptions({ name: 'ClFileEditorNavMenuContextMenu' });
import { computed } from 'vue';
import { useStore } from 'vuex';
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
  (e: 'new-file'): void;
  (e: 'new-file-with-ai'): void;
  (e: 'new-directory'): void;
  (e: 'rename'): void;
  (e: 'clone'): void;
  (e: 'delete'): void;
}>();

const t = translate;

const store = useStore();
const { common: commonState } = store.state as RootStoreState;

const systemInfo = computed<SystemInfo>(() => commonState.systemInfo || {});

const items = computed<ContextMenuItem[]>(() => [
  {
    title: t('components.file.editor.navMenu.newFile'),
    icon: ['fa', 'file-alt'],
    className: 'new-file',
    action: () => emit('new-file'),
  },
  {
    title: t('components.file.editor.navMenu.newFileWithAi'),
    icon: ['fa', 'robot'],
    className:
      'new-file-with-ai' +
      (systemInfo.value.edition === 'global.edition.community'
        ? ' disabled'
        : ''),
    action: () => emit('new-file-with-ai'),
  },
  {
    title: t('components.file.editor.navMenu.newDirectory'),
    icon: ['fa', 'folder-plus'],
    className: 'new-directory',
    action: () => emit('new-directory'),
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
