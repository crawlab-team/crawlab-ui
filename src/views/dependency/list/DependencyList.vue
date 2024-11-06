<script setup lang="ts">
import { useStore } from 'vuex';
import { useDependencyList } from '@/views';
import { getIconByAction, translate } from '@/utils';
import { ACTION_FILTER_SEARCH } from '@/constants';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();

const {
  actionFunctions,
  navActions,
  tableLoading,
  tableColumns,
  tableData,
  tablePagination,
  tablePageSizes,
  tableTotal,
  repoTabName,
  repoTabItems,
  onClickTableEmptySearch,
  rowKey,
} = useDependencyList();

const onTabSelect = (key: string) => {
  store.commit(`${ns}/setRepoTabName`, key);
};

defineOptions({ name: 'ClDependencyList' });
</script>

<template>
  <cl-list-layout
    class="dependency-list"
    :row-key="rowKey"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-loading="tableLoading"
    :table-pagination="tablePagination"
    :table-page-sizes="tablePageSizes"
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
    <template #table-empty>
      <cl-label-button
        size="large"
        :icon="getIconByAction(ACTION_FILTER_SEARCH)"
        :label="t('views.env.deps.repos.actions.search.label')"
        :tooltip="t('views.env.deps.repos.actions.search.tooltip')"
        @click="onClickTableEmptySearch"
      />
    </template>
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-dependency-install-dialog />
      <cl-dependency-uninstall-dialog />
      <cl-dependency-logs-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
