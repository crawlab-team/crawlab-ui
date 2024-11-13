<script setup lang="ts">
import { useProjectList } from '@/views';

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
  selectableFunction,
} = useProjectList();

defineOptions({ name: 'ClProjectList' });
</script>

<template>
  <cl-list-layout
    class="project-list"
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
      <cl-create-edit-project-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
