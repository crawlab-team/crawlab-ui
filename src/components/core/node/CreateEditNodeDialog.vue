<script setup lang="ts">
import { useStore } from 'vuex';
import useNode from '@/components/core/node/useNode';

// store
const store = useStore();

const {
  actionFunctions,
  activeDialogKey,
  confirmDisabled,
  confirmLoading,
  createEditDialogVisible,
} = useNode(store);
defineOptions({ name: 'ClCreateEditNodeDialog' });
</script>

<template>
  <!--TODO: implement creating node actively later-->
  <cl-create-edit-dialog
    v-if="false"
    :action-functions="actionFunctions"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
  >
    <template #default>
      <cl-node-form />
    </template>
  </cl-create-edit-dialog>
</template>


