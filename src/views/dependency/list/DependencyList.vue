<script setup lang="ts">
import { useStore } from 'vuex';
import { useDependencyList } from '@/views';

const ns: ListStoreNamespace = 'dependency';
const store = useStore();

const {
  actionFunctions,
  navActions,
  tableLoading,
  tableColumns,
  tableData,
  tablePagination,
  tableTotal,
  repoTabName,
  repoTabItems,
  rowKey,
} = useDependencyList();

const onTabSelect = (key: string) => {
  store.commit(`${ns}/setRepoTabName`, key);
};

defineOptions({ name: 'ClDependencyList' });
</script>

<template>
  <cl-list-layout
    v-loading="tableLoading"
    class="dependency-list"
    :row-key="rowKey"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
  >
    <template #tabs>
      <cl-nav-tabs
        :active-key="repoTabName"
        :items="repoTabItems"
        @select="onTabSelect"
      />
    </template>
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-dependency-install-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
