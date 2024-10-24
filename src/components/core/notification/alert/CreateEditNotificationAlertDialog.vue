<script setup lang="ts">
import { useStore } from 'vuex';
import useNotificationAlert from '@/components/core/notification/alert/useNotificationAlert';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useNotificationAlert(store);
defineOptions({ name: 'ClCreateEditNotificationAlertDialog' });
</script>

<template>
  <cl-create-edit-dialog
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
  >
    <template #default>
      <cl-notification-alert-form />
    </template>
  </cl-create-edit-dialog>
</template>


