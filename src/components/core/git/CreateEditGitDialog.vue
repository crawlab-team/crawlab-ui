<script setup lang="ts">
import { useStore } from 'vuex';
import useGit from '@/components/core/git/useGit';

// store
const store = useStore();

const {
  activeDialogKey,
  createEditDialogVisible,
  actionFunctions,
  formList,
  confirmDisabled,
  confirmLoading,
} = useGit(store);
defineOptions({ name: 'ClCreateEditGitDialog' });
</script>

<template>
  <cl-create-edit-dialog
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    :action-functions="actionFunctions"
    :batch-form-data="formList"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
  >
    <template #default>
      <cl-git-form />
    </template>
  </cl-create-edit-dialog>
</template>
