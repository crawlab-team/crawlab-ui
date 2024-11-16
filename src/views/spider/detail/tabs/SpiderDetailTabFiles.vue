<script setup lang="ts">
import { useStore } from 'vuex';
import useSpiderService from '@/services/spider/spiderService';
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';

// store
const ns = 'spider';
const store = useStore();
const { spider: state } = store.state as RootStoreState;

const { activeId } = useSpiderDetail();
defineOptions({ name: 'ClSpiderDetailTabFiles' });
</script>

<template>
  <cl-file-tab
    :ns="ns"
    :active-id="activeId"
    :content="state.fileContent"
    :nav-items="state.fileNavItems"
    :active-nav-item="state.activeFileNavItem"
    :services="useSpiderService(store)"
    :default-file-paths="state.defaultFilePaths"
  />
</template>
