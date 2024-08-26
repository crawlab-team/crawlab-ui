<script setup lang="tsx">
import { computed, type CSSProperties, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { CellStyle, ColumnStyle, ElMessage } from 'element-plus';
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

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const internalTable = ref<DatabaseTable | undefined>(plainClone(props.table));
watch(
  () => props.table,
  () => {
    internalTable.value = plainClone(props.table);
  }
);

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

const columnsTableColumns = computed<TableColumns<DatabaseColumn>>(() => [
  {
    key: 'actions',
    label: t('components.table.columns.actions'),
    width: 80,
    value: (row: DatabaseColumn) => (
      <div class="actions">
        <ClContextMenu
          trigger="click"
          placement="right"
          visible={row.contextMenuVisible}
        >
          {{
            default: () => (
              <ClContextMenuList
                items={[
                  {
                    title: t('common.actions.insertBefore'),
                    icon: ['fa', 'arrows-up-to-line'],
                    action: () => {
                      onAddColumn(row, true);
                    },
                  },
                  {
                    title: t('common.actions.insertAfter'),
                    icon: ['fa', 'arrows-down-to-line'],
                    action: () => {
                      onAddColumn(row, false);
                    },
                  },
                ]}
                onHide={() => {
                  row.contextMenuVisible = false;
                }}
              />
            ),
            reference: () => (
              <ClIcon
                icon={['fa', 'plus']}
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  row.contextMenuVisible = true;
                }}
              />
            ),
          }}
        </ClContextMenu>
        {row.status !== 'deleted' ? (
          <ClIcon icon={['fa', 'minus']} onClick={() => onDeleteColumn(row)} />
        ) : (
          <ClIcon
            icon={['fa', 'rotate-left']}
            onClick={() => onRevertColumn(row)}
          />
        )}
      </div>
    ),
  },
  {
    key: 'name',
    label: t('components.database.databases.table.columns.name'),
    width: 200,
    value: (row: DatabaseColumn) => (
      <ClTableEditCell
        modelValue={row.name}
        onChange={(val: string) => {
          row.name = val;
        }}
      />
    ),
    noPadding: true,
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
  return internalTable.value?.columns || [];
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

const onAddColumn = (column?: DatabaseColumn, before?: boolean) => {
  const newColumn: DatabaseColumn = {
    name: '',
    type: '',
    null: true,
    default: '',
    status: 'new',
  };
  if (column === undefined) {
    internalTable.value?.columns?.push(newColumn);
  } else {
    const index = internalTable.value?.columns?.findIndex(
      c => c.name === column.name
    );
    if (typeof index === 'undefined') return;
    if (before) {
      internalTable.value?.columns?.splice(index, 0, newColumn);
    } else {
      internalTable.value?.columns?.splice(index + 1, 0, newColumn);
    }
  }
};
const onDeleteColumn = (column: DatabaseColumn) => {
  if (column.status === 'new') {
    const index = internalTable.value?.columns?.findIndex(
      c => c.name === column.name
    );
    if (typeof index === 'undefined') return;
    internalTable.value?.columns?.splice(index, 1);
    return;
  } else {
    column.status = 'deleted';
  }
};
const onRevertColumn = (column: DatabaseColumn) => {
  column.status = undefined;
};

const getColumnStatus = (column: DatabaseColumn) => {
  if (column.status && column.status !== 'updated') return column.status;
  const hasColumn = props.table?.columns?.some(
    c =>
      column.name === c.name &&
      column.type === c.type &&
      column.null === c.null &&
      column.default === c.default
  );
  if (hasColumn) return;
  return 'updated';
};

const columnRowStyle: ColumnStyle<DatabaseColumn> = ({
  row,
}): CSSProperties => {
  let backgroundColor: string | undefined = undefined;
  let color: string | undefined = undefined;
  const status = getColumnStatus(row);
  switch (status) {
    case 'new':
      color = 'var(--cl-success-color)';
      backgroundColor = 'var(--cl-success-plain-color)';
      break;
    case 'updated':
      color = 'var(--cl-primary-color)';
      backgroundColor = 'var(--cl-primary-plain-color)';
      break;
    case 'deleted':
      color = 'var(--cl-danger-color)';
      backgroundColor = 'var(--cl-danger-plain-color)';
      break;
  }
  return {
    color,
    backgroundColor,
  };
};
const columnCellStyle: CellStyle<DatabaseColumn> = ({ row, column }) => {
  if (column.columnKey === 'actions') {
    return;
  }
  const originalColumn = props.table?.columns?.find(c => c.hash === row.hash);
  if (!originalColumn) return;
  if (row[column.columnKey] === originalColumn[column.columnKey]) {
    return;
  }
  return {
    fontWeight: 'bold',
  };
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
          @pagination-change="onDataTablePaginationChange"
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_COLUMNS">
        <cl-table
          :row-key="(row: DatabaseColumn) => JSON.stringify(row)"
          :columns="columnsTableColumns"
          :data="columnsTableData"
          :row-style="columnRowStyle"
          :cell-style="columnCellStyle"
          hide-footer
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_INDEXES">
        <cl-table
          :row-key="(row: DatabaseColumn) => JSON.stringify(row)"
          :columns="indexesTableColumns"
          :data="indexesTableData"
          hide-footer
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
