<script setup lang="ts">
import { useStore } from 'vuex';
import useGitService from '@/services/git/gitService';
import useGitDetail from '@/views/git/detail/useGitDetail';

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;
const { activeId } = useGitDetail();
defineOptions({ name: 'ClUploadGitFilesDialog' });
</script>

<template>
  <cl-upload-files-dialog
    :ns="ns"
    :active-dialog-key="state.activeDialogKey"
    :active-id="activeId"
    :form="state.form"
    :services="useGitService(store)"
    :file-nav-items="state.fileNavItems"
    :default-target-directory="state.activeFileNavItem?.path"
  />
</template>
