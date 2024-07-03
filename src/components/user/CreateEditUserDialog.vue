<script setup lang="ts">
import { useStore } from 'vuex';
import useUser from '@/components/user/useUser';

// store
const store = useStore();

const {
  actionFunctions,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
  formRules,
  activeDialogKey,
} = useUser(store);
defineOptions({ name: 'ClCreateEditUserDialog' });
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :form-rules="formRules"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
  >
    <template #default>
      <cl-user-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
