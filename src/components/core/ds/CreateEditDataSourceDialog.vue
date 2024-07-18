<script setup lang="ts">
import { getStore } from '@/store';
import useDataSource from '@/components/core/ds/useDataSource';

const store = getStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useDataSource(store);
defineOptions({ name: 'ClCreateEditDataSourceDialog' });
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
      <cl-data-source-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
