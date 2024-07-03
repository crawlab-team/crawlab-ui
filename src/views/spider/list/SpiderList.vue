<script setup lang="ts">
import useSpiderList from '@/views/spider/list/useSpiderList';

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
  tableListFilter,
  tableListSort,
  actionFunctions,
  tableActionsPrefix,
} = useSpiderList();
defineOptions({ name: 'ClSpiderList' });
</script>

<template>
  <cl-list-layout
    class="spider-list"
    :row-key="
      ({ _id, last_task, stat }: Spider) =>
        [_id, last_task?.status, JSON.stringify(stat)].join('_')
    "
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :table-filter="tableListFilter"
    :table-sort="tableListSort"
    :table-actions-prefix="tableActionsPrefix"
    :no-actions="noActions"
    :embedded="embedded"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-spider-dialog />
      <cl-run-spider-dialog />
      <cl-upload-spider-files-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style lang="scss" scoped>
.spider-list {
  .nav-actions {
    border-bottom: none;
  }

  .content {
    background-color: var(--cl-container-white-bg);
  }
}
</style>
