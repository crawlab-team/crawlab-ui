<script lang="ts">
import { defineComponent } from 'vue';
import useNodeList from '@/views/node/list/useNodeList';

export default defineComponent({
  name: 'NodeList',
  setup() {
    return {
      ...useNodeList(),
    };
  },
});
</script>

<template>
  <cl-list-layout
    class="node-list"
    :row-key="(row: CNode) => [row._id, row.status].join('_')"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :visible-buttons="visibleButtons"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-node-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style lang="scss" scoped></style>
