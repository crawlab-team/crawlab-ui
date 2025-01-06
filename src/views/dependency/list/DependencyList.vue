<script setup lang="ts">
import { useStore } from 'vuex';
import { useDependencyList } from '@/views';
import { getIconByAction, getIconByRouteConcept, translate } from '@/utils';
import { ACTION_FILTER_SEARCH } from '@/constants';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();

const {
  config,
  lang,
  actionFunctions,
  navActions,
  tableLoading,
  tableColumns,
  tableData,
  tablePagination,
  tableTotal,
  tableCellStyle,
  repoTabName,
  repoTabItems,
  onClickTableEmptySearch,
  onClickTableEmptyConfigNotSetup,
  onClickTableEmptyJava,
} = useDependencyList();

const onTabSelect = (key: string) => {
  store.commit(`${ns}/setRepoTabName`, key);
};

defineOptions({ name: 'ClDependencyList' });
</script>

<template>
  <cl-list-layout
    class="dependency-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-loading="tableLoading"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :table-cell-style="tableCellStyle"
  >
    <template #tabs>
      <cl-nav-tabs
        :active-key="repoTabName"
        :items="repoTabItems"
        @select="onTabSelect"
      />
    </template>
    <template #table-empty>
      <!-- Empty table for installed and search tabs -->
      <template v-if="['installed', 'search'].includes(repoTabName!)">
        <template v-if="!config?.setup">
          <!-- Config not setup -->
          <h3>{{ t('views.env.deps.repos.empty.configNotSetup.title') }}</h3>
          <p>{{ t('views.env.deps.repos.empty.configNotSetup.content') }}</p>
          <cl-label-button
            size="large"
            :icon="getIconByRouteConcept('node')"
            :label="t('views.env.deps.repos.empty.configNotSetup.action.label')"
            :tooltip="
              t('views.env.deps.repos.empty.configNotSetup.action.tooltip')
            "
            @click="onClickTableEmptyConfigNotSetup"
          />
        </template>
        <!-- ./Config not setup -->

        <!-- Java -->
        <template v-else-if="repoTabName === 'installed' && lang === 'java'">
          <h3>{{ t('views.env.deps.repos.empty.java.title') }}</h3>
          <p>{{ t('views.env.deps.repos.empty.java.content') }}</p>
          <cl-label-button
            size="large"
            :icon="getIconByRouteConcept('spider')"
            :label="t('views.env.deps.repos.empty.java.action.label')"
            :tooltip="t('views.env.deps.repos.empty.java.action.tooltip')"
            @click="onClickTableEmptyJava"
          />
        </template>
        <!-- ./Java -->

        <!-- Search -->
        <template v-else>
          <template v-if="!config.search_ready">
            <template v-if="lang === 'python'">
              <h3>
                {{
                  t('views.env.deps.repos.actions.searchNotReady.python.title')
                }}
              </h3>
              <p>
                {{
                  t(
                    'views.env.deps.repos.actions.searchNotReady.python.content'
                  )
                }}
              </p>
            </template>
            <cl-label-button
              disabled
              size="large"
              :icon="getIconByAction(ACTION_FILTER_SEARCH)"
              :label="t('views.env.deps.repos.actions.searchNotReady.label')"
              :tooltip="
                t('views.env.deps.repos.actions.searchNotReady.tooltip')
              "
            />
          </template>
          <template v-else>
            <cl-label-button
              size="large"
              :icon="getIconByAction(ACTION_FILTER_SEARCH)"
              :label="
                t('views.env.deps.repos.actions.search.label') +
                (config.total_dependencies
                  ? ` (${config.total_dependencies.toLocaleString()})`
                  : '')
              "
              :tooltip="t('views.env.deps.repos.actions.search.tooltip')"
              @click="onClickTableEmptySearch"
            />
          </template>
        </template>
        <!-- ./Search -->
      </template>
      <!-- ./Empty table for installed and search tabs -->
    </template>
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-dependency-install-dialog />
      <cl-dependency-uninstall-dialog />
      <cl-dependency-logs-dialog />
      <cl-dependency-config-dialog />
      <cl-dependency-setup-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped>
.dependency-list {
  &:deep(.el-table__empty-text) {
    line-height: 1.2;
  }
}

.icon-wrapper {
  &:deep(img) {
    filter: grayscale(100);
  }
}
</style>
