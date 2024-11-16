<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce } from '@/utils';
import useGitService from '@/services/git/gitService';
import useGitDetail from '@/views/git/detail/useGitDetail';
import type {
  ContextMenuItem,
  FileEditorContextMenuItemVisibleFn,
} from '@/components/ui/context-menu/types';

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId, currentBranch, fileContent } = useGitDetail();

const navMenuLoading = ref(false);

const getFiles = debounce(async () => {
  if (!activeId.value) return;
  navMenuLoading.value = true;
  try {
    await store.dispatch(`${ns}/listDir`, { id: activeId.value });
  } finally {
    navMenuLoading.value = false;
  }
});
watch(currentBranch, getFiles);
watch(activeId, getFiles);

const onFileChange = () => {
  store.dispatch(`${ns}/getChanges`, { id: activeId.value });
};

const onCreateSpider = (item: FileNavItem) => {
  store.dispatch(`${ns}/clickCreateSpider`, item);
};

provide<FileEditorContextMenuItemVisibleFn>(
  'context-menu-item-visible-fn',
  (
    contextMenuItem: ContextMenuItem,
    activeFileNavItem?: FileNavItem
  ): boolean => {
    if (contextMenuItem.className === 'create-spider') {
      return !!activeFileNavItem?.is_dir;
    }
    return true;
  }
);

defineOptions({ name: 'ClGitDetailTabFiles' });
</script>

<template>
  <cl-file-tab
    :ns="ns"
    :active-id="activeId"
    :content="fileContent"
    :nav-items="state.fileNavItems"
    :active-nav-item="state.activeFileNavItem"
    :services="useGitService(store)"
    :default-file-paths="state.defaultFilePaths"
    :nav-menu-loading="navMenuLoading"
    @file-change="onFileChange"
    @create-spider="onCreateSpider"
  />
</template>
