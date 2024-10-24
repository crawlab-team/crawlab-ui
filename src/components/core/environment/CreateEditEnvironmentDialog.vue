<script setup lang="ts">
import useEnvironment from '@/components/core/environment/useEnvironment';
import { getStore } from '@/store';

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useEnvironment(getStore());
defineOptions({ name: 'ClCreateEditEnvironmentDialog' });
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    no-batch
  >
    <template #default>
      <cl-environment-form />
    </template>
  </cl-create-edit-dialog>
</template>


