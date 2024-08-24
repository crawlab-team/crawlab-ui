<script setup lang="tsx">
import { computed, onBeforeMount, ref, watch } from 'vue';
import {
  TAB_NAME_COLUMNS,
  TAB_NAME_DATA,
  TAB_NAME_INDEXES,
  TAB_NAME_OVERVIEW,
} from '@/constants';
import { translate } from '@/utils';
import { ClResultCell } from '@/components';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const props = withDefaults(
  defineProps<{
    activeId?: string;
    databaseName?: string;
    table?: DatabaseTable;
    defaultTabName?: string;
  }>(),
  {
    defaultTabName: TAB_NAME_OVERVIEW,
  }
);

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const activeTabName = ref<string>(props.defaultTabName);
const tabsItems = computed<NavItem[]>(() => [
  { id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') },
  { id: TAB_NAME_DATA, title: t('common.tabs.data') },
  { id: TAB_NAME_COLUMNS, title: t('common.tabs.columns') },
  { id: TAB_NAME_INDEXES, title: t('common.tabs.indexes') },
]);
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

const form = ref<DatabaseTable>(props.table || {});
watch(
  () => props.table,
  async () => {
    form.value = props.table || {};
    await fetchData();
  }
);

const columnsTableColumns = computed<TableColumns<DatabaseColumn>>(() => [
  {
    key: 'name',
    label: t('components.database.databases.table.columns.name'),
    width: 200,
  },
  {
    key: 'type',
    label: t('components.database.databases.table.columns.type'),
    width: 200,
  },
  {
    key: 'null',
    label: t('components.database.databases.table.columns.null'),
    width: 200,
  },
  {
    key: 'default',
    label: t('components.database.databases.table.columns.default'),
    width: 200,
  },
]);

const columnsTableData = computed<TableData<DatabaseColumn>>(() => {
  return props.table?.columns || [];
});

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
  return props.table?.indexes || [];
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
  if (!props.table) return;
  tablePreviewLoading.value = true;
  const { name: table } = props.table;
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
  const { columns } = props.table || {};
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

defineOptions({ name: 'ClDatabaseTableDetail' });
</script>

<template>
  <div class="database-table-detail">
    <cl-nav-tabs
      :active-key="activeTabName"
      :items="tabsItems"
      @select="(key: string) => (activeTabName = key)"
    />
    <div class="tab-content">
      <template v-if="activeTabName === TAB_NAME_OVERVIEW">
        <cl-form :model="form">
          <cl-form-item
            :span="4"
            :label="t('components.database.databases.table.name')"
            prop="name"
            required
          >
            <el-input
              v-model="form.name"
              :placeholder="t('components.database.databases.table.name')"
            />
          </cl-form-item>
        </cl-form>
      </template>
      <template v-else-if="activeTabName === TAB_NAME_DATA">
        <cl-table
          :loading="tablePreviewLoading"
          :key="JSON.stringify(props.table)"
          :row-key="(row: Record<string, any>) => JSON.stringify(row)"
          :columns="dataTableColumns"
          :data="dataTableData"
          :page="dataTablePagination.page"
          :page-size="dataTablePagination.size"
          :total="dataTableTotal"
          @pagination-change="onDataTablePaginationChange"
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_COLUMNS">
        <cl-table
          :row-key="(row: any) => JSON.stringify(row)"
          :columns="columnsTableColumns"
          :data="columnsTableData"
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_INDEXES">
        <cl-table
          :row-key="(row: any) => JSON.stringify(row)"
          :columns="indexesTableColumns"
          :data="indexesTableData"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.database-table-detail {
  display: flex;
  flex-direction: column;

  .tab-content {
    flex: 1;

    &:deep(.el-form) {
      padding: 20px;
    }
  }
}
</style>
