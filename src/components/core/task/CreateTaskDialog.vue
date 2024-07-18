<script setup lang="ts">
import { useStore } from 'vuex';
import useTask from '@/components/core/task/useTask';

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
  activeDialogKey,
  createEditDialogVisible,
} = useTask(store);
defineOptions({ name: 'ClCreateTaskDialog' });
</script>

<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :batch-form-data="formList"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
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
