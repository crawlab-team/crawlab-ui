<script setup lang="ts">
defineOptions({ name: 'ClCreateEditProjectDialog' });
import { useStore } from 'vuex';
import useProject from '@/components/project/useProject';

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
} = useProject(store);
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
      <cl-project-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
