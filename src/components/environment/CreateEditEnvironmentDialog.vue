<script setup lang="ts">
defineOptions({ name: 'ClCreateEditEnvironmentDialog' });
import useEnvironment from '@/components/environment/useEnvironment';
import { getStore } from '@/store';

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogTabName,
  createEditDialogVisible,
} = useEnvironment(getStore());
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :tab-name="createEditDialogTabName"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    no-batch
  >
    <template #default>
      <cl-environment-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
