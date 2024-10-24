<script setup lang="ts">
import { useStore } from 'vuex';
import useNotificationSetting from '@/components/core/notification/setting/useNotificationSetting';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useNotificationSetting(store);
defineOptions({ name: 'ClCreateEditNotificationSettingDialog' });
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
      <cl-notification-setting-form />
    </template>
  </cl-create-edit-dialog>
</template>


