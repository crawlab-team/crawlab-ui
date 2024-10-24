<script setup lang="ts">
import { useStore } from 'vuex';
import useSpider from '@/components/core/spider/useSpider';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useSpider(store);
defineOptions({ name: 'ClCreateEditSpiderDialog' });
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


