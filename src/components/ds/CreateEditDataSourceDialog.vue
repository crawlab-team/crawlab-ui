<script setup lang="ts">
defineOptions({ name: 'ClCreateEditDataSourceDialog' });
import { getStore } from '@/store';
import useDataSource from '@/components/ds/useDataSource';

const store = getStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogTabName,
  createEditDialogVisible,
} = useDataSource(store);
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :tab-name="createEditDialogTabName"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
  >
    <template #default>
      <cl-data-source-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
