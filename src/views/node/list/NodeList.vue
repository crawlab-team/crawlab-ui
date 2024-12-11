<script setup lang="ts">
import { useStore } from 'vuex';
import useNodeList from '@/views/node/list/useNodeList';

const store = useStore();
const { node: state } = store.state as RootStoreState;

const {
  actionFunctions,
  navActions,
  tablePagination,
  tableColumns,
  tableData,
  tableTotal,
  selectableFunction,
} = useNodeList();

defineOptions({ name: 'ClNodeList' });
</script>

<template>
  <cl-list-layout
    class="node-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :selectable-function="selectableFunction"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-node-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped>
.node-list {
  &:deep(.current-metrics .tag) {
    margin: 3px 0;
  }
}
</style>
