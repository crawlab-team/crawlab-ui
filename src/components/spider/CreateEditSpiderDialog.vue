<script setup lang="ts">
defineOptions({ name: 'ClCreateEditSpiderDialog' });
import { useStore } from 'vuex';
import useSpider from '@/components/spider/useSpider';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useSpider(store);
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
      <cl-spider-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
