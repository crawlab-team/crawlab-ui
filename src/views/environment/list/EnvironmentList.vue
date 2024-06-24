<script lang="ts">
import { defineComponent } from 'vue';
import useEnvironmentList from '@/views/environment/list/useEnvironmentList';

export default defineComponent({
  name: 'EnvironmentList',
  setup() {
    return {
      ...useEnvironmentList(),
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
    class="environment-list"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-environment-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style lang="scss" scoped></style>
