<script setup lang="ts">
defineOptions({ name: 'ClGitDetailTabFiles' });
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce } from '@/utils';
import useGitService from '@/services/git/gitService';
import useGitDetail from '@/views/git/detail/useGitDetail';

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId, currentBranch } = useGitDetail();

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
</script>

<template>
  <cl-file-tab
    :ns="ns"
    :active-id="activeId"
    :content="state.fileContent"
    :nav-items="state.fileNavItems"
    :active-nav-item="state.activeNavItem"
    :services="useGitService(store)"
    :default-file-paths="state.defaultFilePaths"
    :nav-menu-loading="navMenuLoading"
    @file-change="onFileChange"
  />
</template>

<style lang="scss" scoped></style>
