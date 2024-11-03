<script setup lang="ts">
import useTaskList from '@/views/task/list/useTaskList';

defineProps<{
  noActions?: boolean;
  embedded?: boolean;
}>();

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
} = useTaskList();

defineOptions({ name: 'ClTaskList' });
</script>

<template>
  <cl-list-layout
    class="task-list"
    :row-key="
      ({ _id, status, stat }: Task) =>
        [_id, status, JSON.stringify(stat)].join('_')
    "
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :no-actions="noActions"
    :embedded="embedded"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-task-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
