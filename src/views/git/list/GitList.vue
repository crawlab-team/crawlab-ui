<script setup lang="ts">
defineOptions({ name: 'ClGitList' });
import useGitList from '@/views/git/list/useGitList';

const {
  actionFunctions,
  navActions,
  tablePagination,
  tableColumns,
  tableData,
  tableTotal,
} = useGitList();
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
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-git-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped lang="scss"></style>
