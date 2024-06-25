<script setup lang="ts">
defineOptions({ name: 'ClTokenList' });
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
</script>

<template>
  <cl-list-layout
    class="token-list"
    :row-key="(row: Token) => [row._id, row._visible].join('_')"
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

<style lang="scss" scoped></style>
