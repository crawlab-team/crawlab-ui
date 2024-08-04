<script setup lang="ts">
import useDatabaseList from '@/views/database/list/useDatabaseList';

const {
  actionFunctions,
  navActions,
  tableColumns,
  tableData,
  tablePagination,
  tableTotal,
} = useDatabaseList();
defineOptions({ name: 'ClDatabaseList' });
</script>

<template>
  <cl-list-layout
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    class="database-list"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-database-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
