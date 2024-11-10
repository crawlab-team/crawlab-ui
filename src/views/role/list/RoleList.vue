<script setup lang="ts">
import { useRoleList } from '@/views';

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
  selectableFunction,
} = useRoleList();

defineOptions({ name: 'ClRoleList' });
</script>

<template>
  <cl-list-layout
    class="role-list"
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
      <cl-create-edit-role-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
