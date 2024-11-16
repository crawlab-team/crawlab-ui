<script setup lang="ts">
import { useStore } from 'vuex';
import useSpiderService from '@/services/spider/spiderService';
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';

// store
const ns = 'spider';
const store = useStore();
const { spider: state } = store.state as RootStoreState;
const { activeId } = useSpiderDetail();
defineOptions({ name: 'ClUploadSpiderFilesDialog' });
</script>

<template>
  <cl-upload-files-dialog
    :ns="ns"
    :active-dialog-key="state.activeDialogKey"
    :active-id="activeId"
    :form="state.form"
    :services="useSpiderService(store)"
    :file-nav-items="state.fileNavItems"
    :default-target-directory="state.activeFileNavItem?.path"
  />
</template>
