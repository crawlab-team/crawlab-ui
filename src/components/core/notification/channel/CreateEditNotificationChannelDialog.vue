<script setup lang="ts">
import { useStore } from 'vuex';
import useNotificationChannel from '@/components/core/notification/channel/useNotificationChannel';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useNotificationChannel(store);

defineOptions({ name: 'ClCreateEditNotificationChannelDialog' });
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
      <cl-notification-channel-form />
    </template>
  </cl-create-edit-dialog>
</template>


