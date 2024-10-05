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
  visibleButtons,
} = useNodeList();

const getCurrentMetrics = (row: CNode) => {
  if (!row._id) return;
  return state.nodeMetricsMap[row._id];
};

defineOptions({ name: 'ClNodeList' });
</script>

<template>
  <cl-list-layout
    class="node-list"
    :row-key="
      (row: CNode) =>
        [row._id, row.status, JSON.stringify(getCurrentMetrics(row))].join('_')
    "
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :visible-buttons="visibleButtons"
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
