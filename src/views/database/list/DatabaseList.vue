<script setup lang="ts">
import { useDatabaseList } from '@/views';

const {
  actionFunctions,
  navActions,
  tableColumns,
  tableData,
  tablePagination,
  tableTotal,
  selectableFunction,
} = useDatabaseList();

defineOptions({ name: 'ClDatabaseList' });
</script>

<template>
  <cl-list-layout
    class="database-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :selectable-function="selectableFunction"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-database-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
