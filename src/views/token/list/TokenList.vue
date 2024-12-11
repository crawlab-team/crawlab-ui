<script setup lang="ts">
import useTokenList from '@/views/token/list/useTokenList';

defineProps<{
  noActions?: boolean;
  embedded?: boolean;
}>();

const {
  actionFunctions,
  navActions,
  tablePagination,
  tableColumns,
  tableData,
  tableTotal,
} = useTokenList();
defineOptions({ name: 'ClTokenList' });
</script>

<template>
  <cl-list-layout
    class="token-list"
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
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
