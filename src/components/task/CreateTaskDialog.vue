<script setup lang="ts">
defineOptions({ name: 'ClCreateTaskDialog' });
import { useStore } from 'vuex';
import useTask from '@/components/task/useTask';

defineProps<{
  title?: string;
}>();

// store
const store = useStore();

const {
  actionFunctions,
  formList,
  confirmDisabled,
  confirmLoading,
  createEditDialogTabName,
  activeDialogKey,
  createEditDialogVisible,
} = useTask(store);
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :batch-form-data="formList"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :tab-name="createEditDialogTabName"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    :title="title"
  >
    <template #default>
      <cl-task-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
