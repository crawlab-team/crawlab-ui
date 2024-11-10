<script setup lang="ts">
import { useStore } from 'vuex';
import { useRole } from '@/components';

// store
const store = useStore();

const {
  actionFunctions,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
  activeDialogKey,
} = useRole(store);

defineOptions({ name: 'ClCreateEditRoleDialog' });
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
  >
    <template #default>
      <cl-role-form />
    </template>
  </cl-create-edit-dialog>
</template>
