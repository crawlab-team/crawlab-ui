<script setup lang="ts">
defineOptions({ name: 'ClCreateEditNodeDialog' });
import { useStore } from 'vuex';
import useNode from '@/components/node/useNode';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogTabName,
  createEditDialogVisible,
} = useNode(store);
</script>

<template>
  <!--TODO: implement creating node actively later-->
  <cl-create-edit-dialog
    v-if="false"
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :tab-name="createEditDialogTabName"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
  >
    <template #default>
      <cl-node-form />
    </template>
  </cl-create-edit-dialog>
</template>

<style lang="scss" scoped></style>
