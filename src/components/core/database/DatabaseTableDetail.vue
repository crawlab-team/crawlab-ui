<script setup lang="tsx">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import {
  TAB_NAME_COLUMNS,
  TAB_NAME_DATA,
  TAB_NAME_INDEXES,
  TAB_NAME_OVERVIEW,
} from '@/constants';
import { plainClone, translate } from '@/utils';
import useRequest from '@/services/request';
import {
  getColumnStatus,
  getIndexStatus,
  isValidTable,
} from '@/utils/database';
import { ClResultCell } from '@/components';

const props = defineProps<{
  activeId?: string;
  databaseName?: string;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const { get, post } = useRequest();

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const defaultTabName = computed(() => state.defaultTabName);

const table = computed<DatabaseTable | undefined>(
  () => state.activeNavItem?.data
);
const isNew = computed(() => state.activeNavItem?.new);
const activeTable = ref<DatabaseTable | undefined>(plainClone(table.value));
const internalTable = ref<DatabaseTable | undefined>(plainClone(table.value));
watch(
  () => table.value?.name,
  () => {
    if (internalTable.value) {
      internalTable.value.name = table.value?.name;
    }
  }
);

const getTable = async () => {
  if (isNew.value) {
    activeTable.value = plainClone(table.value);
  } else {
    const res = await get(
      `/databases/${props.activeId}/tables/metadata?database=${props.databaseName}&table=${table.value?.name}`
    );
    activeTable.value = { ...res.data, timestamp: Date.now() };
  }
};
onBeforeMount(getTable);
watch(table, getTable);

const onRollback = () => {
  internalTable.value = plainClone(activeTable.value);
};
watch(activeTable, onRollback);

const commitLoading = ref(false);
const onCommit = async () => {
  if (isNew.value) {
    return createTable();
  } else {
    return modifyTable();
  }
};

const createTable = async () => {
  commitLoading.value = true;
  try {
    await post(`/databases/${props.activeId}/tables/create`, {
      database_name: props.databaseName,
      table: internalTable.value,
    });
    await getTable();
    store.commit(`${ns}/setActiveNavItem`, {
      ...state.activeNavItem,
      id: `${props.databaseName}:${internalTable.value?.name}`,
      new: false,
    });
  } catch (error: any) {
    ElMessage.error(error.message);
  } finally {
    commitLoading.value = false;
  }
};

const modifyTable = async () => {
  commitLoading.value = true;
  try {
    await post(`/databases/${props.activeId}/tables/modify`, {
      database_name: props.databaseName,
      table: {
        ...internalTable.value,
        columns: internalTable.value?.columns?.map(c => {
          return {
            ...c,
            status: getColumnStatus(c, activeTable.value),
          };
        }),
        indexes: internalTable.value?.indexes?.map(i => {
          return {
            ...i,
            status: getIndexStatus(i, activeTable.value),
          };
        }),
      },
    });
    await getTable();
    emit('refresh');
  } catch (error: any) {
    ElMessage.error(error.message);
  } finally {
    commitLoading.value = false;
  }
};

const activeTabName = ref<string>(defaultTabName.value || TAB_NAME_OVERVIEW);
const tabsItems = computed<NavItem[]>(() =>
  [
    { id: TAB_NAME_DATA, title: t('common.tabs.data') },
    { id: TAB_NAME_COLUMNS, title: t('common.tabs.columns') },
    { id: TAB_NAME_INDEXES, title: t('common.tabs.indexes') },
  ].filter(item => {
    if (isNew.value) {
      return item.id !== TAB_NAME_DATA;
    }
    return true;
  })
);
watch(defaultTabName, () => {
  activeTabName.value = defaultTabName.value || TAB_NAME_OVERVIEW;
});
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
  const hasColumnsChange = internalTable.value.columns?.some(c =>
    getColumnStatus(c, activeTable.value)
  );
  const hasIndexesChange = internalTable.value.indexes?.some(i =>
    getIndexStatus(i, activeTable.value)
  );
  return hasColumnsChange || hasIndexesChange;
});
const tableValid = computed(() => isValidTable(internalTable.value));

const canSave = computed(() => {
  return tableValid.value && hasChanges.value;
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
            :disabled="!canSave"
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
      <template v-if="activeTabName === TAB_NAME_DATA">
        <cl-table
          :loading="tablePreviewLoading"
          :key="JSON.stringify(internalTable)"
          :row-key="(row: TableAnyRowData) => JSON.stringify(row)"
          :columns="dataTableColumns"
          :data="dataTableData"
          :page="dataTablePagination.page"
          :page-size="dataTablePagination.size"
          :total="dataTableTotal"
          embedded
          @pagination-change="onDataTablePaginationChange"
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_COLUMNS">
        <cl-database-table-detail-columns
          v-model="internalTable"
          :active-table="activeTable"
          :loading="commitLoading"
          @change="
            (val: DatabaseTable) => {
              internalTable = val;
            }
          "
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_INDEXES">
        <cl-database-table-detail-indexes
          v-model="internalTable"
          :active-table="activeTable"
          :loading="commitLoading"
          @change="
            (val: DatabaseTable) => {
              internalTable = val;
            }
          "
        />
      </template>
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
  }
}
</style>
