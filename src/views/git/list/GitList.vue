<script setup lang="ts">
import useGitList from '@/views/git/list/useGitList';

const {
  actionFunctions,
  navActions,
  tablePagination,
  tableColumns,
  tableData,
  tableTotal,
  selectableFunction,
} = useGitList();

defineOptions({ name: 'ClGitList' });
</script>

<template>
  <cl-list-layout
    class="git-list"
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
      <cl-create-edit-git-dialog />
      <cl-git-clone-logs-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped>
.git-list:deep(.git-status) {
  margin-right: 0;
}
</style>
