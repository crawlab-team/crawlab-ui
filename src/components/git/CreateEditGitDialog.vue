<script setup lang="ts">
defineOptions({ name: 'ClCreateEditGitDialog' });
import { useStore } from 'vuex';
import useGit from '@/components/git/useGit';

// store
const store = useStore();

const {
  activeDialogKey,
  createEditDialogTabName,
  createEditDialogVisible,
  actionFunctions,
  formList,
  confirmDisabled,
  confirmLoading,
} = useGit(store);
</script>

<template>
  <cl-create-edit-dialog
    :type="activeDialogKey"
    :tab-name="createEditDialogTabName"
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

<style scoped lang="scss"></style>
