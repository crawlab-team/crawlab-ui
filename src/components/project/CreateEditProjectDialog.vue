<template>
  <cl-create-edit-dialog
    :type="activeDialogKey"
    :tab-name="createEditDialogTabName"
    :visible="createEditDialogVisible"
    :action-functions="actionFunctions"
    :batch-form-data="formList"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :batch-form-fields="batchFormFields"
  >
    <template #default>
      <cl-project-form/>
    </template>
  </cl-create-edit-dialog>
</template>

<script lang="ts" setup>
import {useStore} from 'vuex';
import useProject from '@/components/project/project';

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
  batchFormFields,
} = useProject(store);
</script>

<style lang="scss" scoped>

</style>
