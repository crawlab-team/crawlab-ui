<script setup lang="ts">
import { useStore } from 'vuex';
import useProject from '@/components/core/project/useProject';

// store
const store = useStore();

const {
  activeDialogKey,
  createEditDialogVisible,
  actionFunctions,
  formList,
  confirmDisabled,
  confirmLoading,
} = useProject(store);
defineOptions({ name: 'ClCreateEditProjectDialog' });
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
      <cl-project-form />
    </template>
  </cl-create-edit-dialog>
</template>


