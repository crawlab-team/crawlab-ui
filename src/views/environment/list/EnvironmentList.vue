<script setup lang="ts">
import { useEnvironmentList } from '@/views';

const {
  actionFunctions,
  navActions,
  tableColumns,
  tableData,
  tablePagination,
  tableTotal,
} = useEnvironmentList();
defineOptions({ name: 'ClEnvironmentList' });
</script>

<template>
  <cl-list-layout
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    class="environment-list"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-environment-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
