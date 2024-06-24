<script setup lang="ts">
defineOptions({ name: 'ClCreateEditScheduleDialog' });
import { useStore } from 'vuex';
import useSchedule from '@/components/schedule/useSchedule';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogTabName,
  createEditDialogVisible,
  formRules,
} = useSchedule(store);
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :tab-name="createEditDialogTabName"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    :form-rules="formRules"
  >
    <template #default>
      <cl-schedule-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
