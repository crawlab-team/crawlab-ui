<script setup lang="ts">
import { useStore } from 'vuex';
import useSchedule from '@/components/core/schedule/useSchedule';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
  formRules,
} = useSchedule(store);
defineOptions({ name: 'ClCreateEditScheduleDialog' });
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    :form-rules="formRules"
  >
    <template #default>
      <cl-schedule-form />
    </template>
  </cl-create-edit-dialog>
</template>


