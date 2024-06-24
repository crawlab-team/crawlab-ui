<script setup lang="ts">
defineOptions({ name: 'ClCreateEditNotificationDialog' });
import { useStore } from 'vuex';
import useNotification from '@/components/notification/notification';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogTabName,
  createEditDialogVisible,
} = useNotification(store);
</script>

<template>
  <cl-create-edit-dialog
    :type="activeDialogKey"
    :tab-name="createEditDialogTabName"
    :visible="createEditDialogVisible"
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
  >
    <template #default>
      <cl-notification-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
