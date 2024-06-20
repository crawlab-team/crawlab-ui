<script setup lang="ts">
defineOptions({ name: 'ClSpiderDetailTabFiles' });
import { useStore } from 'vuex';
import useSpiderService from '@/services/spider/spiderService';
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';

// store
const ns = 'spider';
const store = useStore();
const { spider: state } = store.state as RootStoreState;

const { activeId } = useSpiderDetail();
</script>

<template>
  <cl-file-tab
    :ns="ns"
    :active-id="activeId"
    :content="state.fileContent"
    :nav-items="state.fileNavItems"
    :active-nav-item="state.activeNavItem"
    :services="useSpiderService(store)"
    :default-file-paths="state.defaultFilePaths"
  />
</template>

<style lang="scss" scoped></style>
