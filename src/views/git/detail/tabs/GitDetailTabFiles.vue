<script setup lang="ts">
defineOptions({ name: 'ClGitDetailTabFiles' });
import { useStore } from 'vuex';
import useGitService from '@/services/git/gitService';
import useGitDetail from '@/views/git/detail/useGitDetail';

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId } = useGitDetail();
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
  />
</template>

<style lang="scss" scoped></style>
