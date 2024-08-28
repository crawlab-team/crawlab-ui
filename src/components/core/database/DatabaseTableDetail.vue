<script setup lang="tsx">
import { computed, type CSSProperties, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import {
  ElMessage,
  type CellStyle,
  type ColumnStyle,
  type AutocompleteFetchSuggestionsCallback,
} from 'element-plus';
import {
  TAB_NAME_COLUMNS,
  TAB_NAME_DATA,
  TAB_NAME_INDEXES,
  TAB_NAME_OVERVIEW,
} from '@/constants';
import { plainClone, translate } from '@/utils';
import {
  ClResultCell,
  ClIcon,
  ClContextMenu,
  ClContextMenuList,
  ClTableEditCell,
} from '@/components';
import useRequest from '@/services/request';

const props = withDefaults(
  defineProps<{
    activeId?: string;
    databaseName?: string;
    table?: DatabaseTable;
    defaultTabName?: string;
    isNew?: boolean;
  }>(),
  {
    defaultTabName: TAB_NAME_OVERVIEW,
  }
);

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const { get, post } = useRequest();

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const internalTable = ref<DatabaseTable | undefined>(plainClone(props.table));
watch(
  () => props.table,
  () => onRollback()
);

const commitLoading = ref(false);
const onCommit = async () => {
  commitLoading.value = true;
  try {
    await post(`/databases/${props.activeId}/tables/modify`, {
      database_name: props.databaseName,
      table: internalTable.value,
    });
    emit('refresh');
  } catch (error: any) {
    ElMessage.error(error.message);
  } finally {
    commitLoading.value = false;
  }
};

const onRollback = () => {
  if (!internalTable.value) return;
  internalTable.value = plainClone(props.table);
};

const activeTabName = ref<string>(props.defaultTabName);
const tabsItems = computed<NavItem[]>(() =>
  [
    { id: TAB_NAME_DATA, title: t('common.tabs.data') },
    { id: TAB_NAME_COLUMNS, title: t('common.tabs.columns') },
    { id: TAB_NAME_INDEXES, title: t('common.tabs.indexes') },
  ].filter(item => {
    if (props.isNew) {
      return item.id !== TAB_NAME_DATA;
    }
    return true;
  })
);
watch(
  () => props.defaultTabName,
  () => {
    activeTabName.value = props.defaultTabName;
  }
);
watch(activeTabName, () => fetchData());
onBeforeMount(() => {
  fetchData();
});

const form = ref<DatabaseTable>(internalTable.value || {});
watch(
  () => internalTable.value,
  async () => {
    form.value = internalTable.value || {};
    await fetchData();
  }
);

const indexesTableColumns = computed<TableColumns<DatabaseIndex>>(() => [
  {
    key: 'name',
    label: t('components.database.databases.table.indexes.name'),
    width: 200,
  },
  {
    key: 'type',
    label: t('components.database.databases.table.indexes.type'),
    width: 200,
  },
  {
    key: 'columns',
    label: t('components.database.databases.table.indexes.columns'),
    width: 200,
  },
  {
    key: 'unique',
    label: t('components.database.databases.table.indexes.unique'),
    width: 200,
  },
]);

const indexesTableData = computed<TableData<DatabaseIndex>>(() => {
  return internalTable.value?.indexes || [];
});

const resetData = () => {
  store.commit(`${ns}/setTablePreviewData`, []);
  store.commit(`${ns}/setTablePreviewTotal`, 0);
  store.commit(`${ns}/setTablePreviewPagination`, {
    page: 1,
    size: 10,
  });
};
const fetchData = async () => {
  if (activeTabName.value === TAB_NAME_DATA) {
    resetData();
    await getTablePreview();
  }
};
const tablePreviewLoading = ref(false);
const getTablePreview = async () => {
  if (!internalTable.value) return;
  tablePreviewLoading.value = true;
  const { name: table } = internalTable.value;
  const database = props.databaseName;
  try {
    await store.dispatch(`${ns}/getTablePreview`, {
      id: props.activeId,
      database,
      table,
    });
  } catch (error: any) {
    ElMessage.error(error.message);
  } finally {
    tablePreviewLoading.value = false;
  }
};
const dataTableColumns = computed<TableColumns<Record<string, any>>>(() => {
  const { columns } = internalTable.value || {};
  if (!columns) return [];
  return columns.map(c => {
    return {
      key: c.name,
      label: c.name,
      value: (row: Record<string, any>) => (
        <ClResultCell fieldKey={c.name} value={row[c.name || '']} />
      ),
      minWidth: 120,
    } as TableColumn<Record<string, any>>;
  });
});

const dataTableData = computed<Record<string, any>[]>(() => {
  return state.tablePreviewData || [];
});

const dataTablePagination = computed<TablePagination>(
  () => state.tablePreviewPagination
);

const dataTableTotal = computed<number>(() => state.tablePreviewTotal);

const onDataTablePaginationChange = (pagination: TablePagination) => {
  store.commit(`${ns}/setTablePreviewPagination`, pagination);
  getTablePreview();
};

const hasChanges = computed(() => {
  if (!internalTable.value) return false;
  return internalTable.value.columns?.some(c => getColumnStatus(c));
});

defineOptions({ name: 'ClDatabaseTableDetail' });
</script>

<template>
  <div class="database-table-detail">
    <cl-nav-tabs
      :active-key="activeTabName"
      :items="tabsItems"
      @select="(key: string) => (activeTabName = key)"
    >
      <template #extra>
        <div class="nav-tabs-actions">
          <cl-fa-icon-button
            type="primary"
            :icon="['fa', 'save']"
            :tooltip="t('components.database.actions.commitChanges')"
            size="small"
            :disabled="!hasChanges"
            :loading="commitLoading"
            @click.stop="onCommit"
          />
          <cl-fa-icon-button
            type="info"
            :icon="['fa', 'rotate-left']"
            :tooltip="t('components.database.actions.rollbackChanges')"
            size="small"
            :disabled="!hasChanges"
            @click.stop="onRollback"
          />
        </div>
      </template>
    </cl-nav-tabs>
    <div class="tab-content">
      <router-view />
      <!--      <template v-if="activeTabName === TAB_NAME_DATA">-->
      <!--        <cl-table-->
      <!--          :loading="tablePreviewLoading"-->
      <!--          :key="JSON.stringify(internalTable)"-->
      <!--          :row-key="(row: TableAnyRowData) => JSON.stringify(row)"-->
      <!--          :columns="dataTableColumns"-->
      <!--          :data="dataTableData"-->
      <!--          :page="dataTablePagination.page"-->
      <!--          :page-size="dataTablePagination.size"-->
      <!--          :total="dataTableTotal"-->
      <!--          @pagination-change="onDataTablePaginationChange"-->
      <!--        />-->
      <!--      </template>-->
      <!--      <template v-else-if="activeTabName === TAB_NAME_COLUMNS">-->
      <!--        <cl-table-->
      <!--          :loading="commitLoading"-->
      <!--          :key="JSON.stringify(internalTable)"-->
      <!--          :row-key="(row: DatabaseColumn) => JSON.stringify(row)"-->
      <!--          :columns="columnsTableColumns"-->
      <!--          :data="columnsTableData"-->
      <!--          :row-style="columnRowStyle"-->
      <!--          :cell-style="columnCellStyle"-->
      <!--          hide-footer-->
      <!--        />-->
      <!--      </template>-->
      <!--      <template v-else-if="activeTabName === TAB_NAME_INDEXES">-->
      <!--        <cl-table-->
      <!--          :loading="commitLoading"-->
      <!--          :key="JSON.stringify(internalTable)"-->
      <!--          :row-key="(row: DatabaseColumn) => JSON.stringify(row)"-->
      <!--          :columns="indexesTableColumns"-->
      <!--          :data="indexesTableData"-->
      <!--          hide-footer-->
      <!--        />-->
      <!--      </template>-->
    </div>
  </div>
</template>

<style scoped>
.database-table-detail {
  height: 100%;
  display: flex;
  flex-direction: column;

  .nav-tabs {
    flex: 0 0 40px;

    &:deep(.nav-tabs-actions) {
      display: flex;
    }
  }

  .tab-content {
    flex: 1;
    overflow: auto;

    &:deep(.table .table-edit-cell) {
      height: 40px;
    }

    &:deep(.table .table-edit-cell .el-input__wrapper) {
      border-radius: 0;
      box-shadow: none;
    }

    &:deep(.table .table-edit-cell.is-edit .el-input__wrapper) {
      border: 1px solid var(--cl-primary-color);
    }

    &:deep(.table .actions) {
      display: flex;
      align-items: center;
    }

    &:deep(.table .actions > div) {
      display: flex;
      align-items: center;
    }

    &:deep(.table .actions .icon) {
      padding: 5px;
      cursor: pointer;
      color: var(--el-table-text-color);
    }

    &:deep(.table .actions .icon:hover) {
      border-radius: 50%;
      color: var(--cl-primary-color);
      background-color: var(--cl-primary-plain-color);
    }

    &:deep(.table .el-table__row:hover),
    &:deep(.table .el-table__row:hover .el-table__cell) {
      background-color: inherit;
    }

    &:deep(.table .el-table__cell:hover .cell-actions) {
      display: flex;
    }
  }
}
</style>
