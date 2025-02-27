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

defineOptions({ name: 'ClSystemDetailTabEnvironment' });
</script>

<template>
  <cl-list-layout
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    embedded
    class="environment-list"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-environment-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped>
.environment-list {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
