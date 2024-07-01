<script setup lang="ts">
defineOptions({ name: 'ClCreateEditEnvironmentDialog' });
import useEnvironment from '@/components/environment/useEnvironment';
import { getStore } from '@/store';

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useEnvironment(getStore());
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

<style lang="scss" scoped></style>
