<script setup lang="ts">
defineOptions({ name: 'ClCreateEditUserDialog' });
import { useStore } from 'vuex';
import useUser from '@/components/user/useUser';

// store
const store = useStore();

const {
  actionFunctions,
  confirmDisabled,
  confirmLoading,
  createEditDialogTabName,
  createEditDialogVisible,
  formRules,
  activeDialogKey,
} = useUser(store);
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :form-rules="formRules"
    :tab-name="createEditDialogTabName"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
  >
    <template #default>
      <cl-user-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
