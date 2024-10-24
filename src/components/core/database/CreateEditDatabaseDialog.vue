<script setup lang="ts">
import { getStore } from '@/store';
import useDatabase from '@/components/core/database/useDatabase';

const store = getStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useDatabase(store);
defineOptions({ name: 'ClCreateEditDatabaseDialog' });
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
      <cl-database-form />
    </template>
  </cl-create-edit-dialog>
</template>


