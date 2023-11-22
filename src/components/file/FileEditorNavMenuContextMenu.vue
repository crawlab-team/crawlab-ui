<template>
  <cl-context-menu :clicking="clicking" :placement="placement" :visible="visible" @hide="$emit('hide')">
    <template #default>
      <cl-context-menu-list :items="items" @hide="$emit('hide')"/>
    </template>
    <template #reference>
      <slot></slot>
    </template>
  </cl-context-menu>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {contextMenuDefaultProps} from '@/components/context-menu/ContextMenu.vue';
import {useI18n} from 'vue-i18n';
import {useStore} from "vuex";

export default defineComponent({
  name: 'FileEditorNavMenuContextMenu',
  props: contextMenuDefaultProps,
  emits: [
    'hide',
    'new-file',
    'new-file-with-ai',
    'new-directory',
    'rename',
    'clone',
    'delete',
  ],
  setup(_, {emit}) {
    const {t} = useI18n();

    const store = useStore();
    const {
      common: commonState
    } = store.state as RootStoreState;

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
        className: 'new-file-with-ai' + (systemInfo.value.edition === 'global.edition.community' ? ' disabled' : ''),
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

    return {
      items,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
