<script lang="ts">
import { defineComponent } from 'vue';
import useDataSourceList from '@/views/ds/list/useDataSourceList';

export default defineComponent({
  name: 'DataSourceList',
  setup() {
    return {
      ...useDataSourceList(),
    };
  },
});
</script>

<template>
  <cl-list-layout
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    class="data-source-list"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-data-source-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style lang="scss" scoped></style>
