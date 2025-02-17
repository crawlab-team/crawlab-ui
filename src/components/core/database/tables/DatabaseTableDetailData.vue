<script setup lang="tsx">
import { computed, type CSSProperties, onBeforeMount, ref, watch } from 'vue';
import type { CellCls, CellStyle, ColumnStyle } from 'element-plus';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table/defaults';
import useRequest from '@/services/request';
import { ClIcon, ClEditTable, ClTableEditCell } from '@/components';
import { defaultFields, getMd5, plainClone, translate } from '@/utils';
import { getDataType, normalizeDataType } from '@/utils/database';

const props = defineProps<{
  loading?: boolean;
  activeTable?: DatabaseTable;
  activeId?: string;
  databaseName?: string;
  filter?: { [key: string]: any };
  displayAllFields?: boolean;
}>();

const t = translate;

const { post } = useRequest();

const tableRef = ref<typeof ClEditTable | null>(null);

const primaryColumnName = computed(() => {
  return props.activeTable?.columns?.find(c => c.primary)?.name;
});

const getRowHash = (row: DatabaseTableRow) => {
  if (row.__hash__) {
    return row.__hash__;
  }
  if (primaryColumnName.value) {
    return getMd5(row[primaryColumnName.value]);
  }
  return getMd5(row);
};

const getHeaderIcon = (column: DatabaseColumn) => {
  const dataType = getDataType(column.type as string);
  switch (dataType) {
    case 'string':
      return ['fa', 'font'];
    case 'number':
      return ['fa', 'hashtag'];
    case 'boolean':
      return ['fa', 'check'];
    case 'date':
    case 'datetime':
      return ['fa', 'calendar-alt'];
    case 'object':
      return ['fa', 'object-group'];
    case 'array':
      return ['fa', 'list'];
    case 'objectid':
      return ['fa', 'id-card'];
    default:
      return ['fa', 'font'];
  }
};

const tableColumns = computed<TableColumns<DatabaseTableRow>>(() => {
  const { columns } = props.activeTable || {};
  if (!columns) return [];
  return columns
    .filter(col =>
      props.displayAllFields
        ? true
        : !defaultFields.includes(col.name!)
    )
    .map(c => {
      const value = (row: DatabaseTableRow) => (
        <ClTableEditCell
          modelValue={row[c.name!]}
          isEdit={row.__edit__?.[c.name!]}
          dataType={getDataType(c.type!)}
          onChange={(val: any) => {
            const colName = c.name!;
            row[colName] = val;
          }}
          onEdit={(val: boolean) => {
            const colName = c.name!;
            row =
              tableData.value.find(r => getRowHash(r) === getRowHash(row)) ||
              row;
            if (!row.__edit__) row.__edit__ = { [colName]: val };
            row.__edit__[colName] = val;
          }}
        />
      );
      const header = () => (
        <div>
          <span style={{ marginRight: '5px' }}>
            <ClIcon size="small" icon={getHeaderIcon(c)} />
          </span>
          <span>{c.name}</span>
        </div>
      );
      return {
        label: c.name,
        key: c.name,
        width: 200,
        value,
        header,
      };
    }) as TableColumns<DatabaseTableRow>;
});
const tableData = ref<TableData<DatabaseTableRow>>([]);
const tablePagination = ref<TablePagination>({
  page: 1,
  size: 10,
});
const tableTotal = ref(0);
const originalTableData = ref<TableData<DatabaseTableRow>>([]);
const originalTableDataMap = computed(() => {
  return originalTableData.value.reduce(
    (acc, cur) => {
      acc[getRowHash(cur)] = cur;
      return acc;
    },
    {} as { [key: string]: TableAnyRowData }
  );
});

const getTableData = async () => {
  const res = await post<any, Promise<ResponseWithListData>>(
    `/databases/${props.activeId}/tables/data/get`,
    {
      database: props.databaseName,
      table: props.activeTable?.name,
      filter: props.filter,
      page: tablePagination.value.page,
      size: tablePagination.value.size,
    }
  );
  originalTableData.value =
    res.data?.map(row => {
      return { ...row, __hash__: getRowHash(row) };
    }) || [];
  tableData.value = plainClone(originalTableData.value);
  tableTotal.value = res.total || 0;
};
onBeforeMount(getTableData);
watch(() => props.activeTable, getTableData);

const onPaginationChange = (pagination: TablePagination) => {
  tablePagination.value = pagination;
};
watch(tablePagination, getTableData);

const getDataRowStatus = (
  row: DatabaseTableRow
): DatabaseTableItemStatus | undefined => {
  const rowHash = getRowHash(row);
  const originalRow = originalTableDataMap.value[rowHash];
  if (!originalRow) return 'new';
  const columns = props.activeTable?.columns || [];
  if (row.__status__) {
    return row.__status__;
  }
  const hasChange = columns.some(column => {
    const colName = column.name as string;
    const originalValue = originalRow[colName];
    const value = row[colName];
    return JSON.stringify(value) !== JSON.stringify(originalValue);
  });
  return hasChange ? 'updated' : undefined;
};

const dataRowStyle: ColumnStyle<DatabaseTableRow> = ({
  row,
}): CSSProperties => {
  let backgroundColor: string | undefined = undefined;
  let color: string | undefined = undefined;
  const status = getDataRowStatus(row);
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

const isDataRowCellUpdated = (
  row: TableAnyRowData,
  column: TableColumnCtx<DatabaseTableRow>
) => {
  const originalRow = originalTableDataMap.value[getRowHash(row)];
  if (!originalRow) return false;
  const colName = column.columnKey as string;
  return JSON.stringify(row[colName]) !== JSON.stringify(originalRow[colName]);
};

const dataRowCellStyle: CellStyle<DatabaseTableRow> = ({ row, column }) => {
  if (isDataRowCellUpdated(row, column)) {
    return {
      fontWeight: 'bold',
    };
  }
  return {};
};

const dataRowCellClassName: CellCls<DatabaseTableRow> = ({ row, column }) => {
  if (isDataRowCellUpdated(row, column)) {
    return 'updated';
  }
  return '';
};

const onAddDataRow = () => {
  tableData.value.push({
    __hash__: getMd5(new Date().getTime().toString()),
    __status__: 'new',
  });
};

const onDeleteDataRows = () => {
  selectedRows.value.forEach(row => {
    const status = getDataRowStatus(row);
    if (status === 'new') {
      const index = tableData.value.findIndex(
        r => getRowHash(r) === getRowHash(row)
      );
      tableData.value.splice(index, 1);
      return;
    }
    row.__status__ = 'deleted';
  });
  tableRef.value?.clearSelection?.();
};

const rollback = () => {
  tableData.value = plainClone(originalTableData.value);
  tablePagination.value = { page: 1, size: 10 };
  tableRef.value?.clearSelection?.();
};

const commit = async () => {
  await post(`/databases/${props.activeId}/tables/data`, {
    database_name: props.databaseName,
    table_name: props.activeTable?.name,
    rows: tableData.value
      .filter(row => getDataRowStatus(row))
      .map(row => {
        switch (getDataRowStatus(row)) {
          case 'new':
            // create new row
            const d: any = {};

            // iterate through columns
            props.activeTable?.columns?.forEach(column => {
              // get column name
              const colName = column.name as string;

              // skip undefined or null values
              if (row[colName] === undefined || row[colName] === null) return;

              // normalize data type
              d[colName] = normalizeDataType(
                row[colName],
                column.type as string
              );
            });

            // return new row
            return { row: d, status: 'new' };

          case 'updated':
            const updateFilter: any = {};
            const update: any = {};
            props.activeTable?.columns?.forEach(column => {
              const colName = column.name as string;
              const originalValue =
                originalTableDataMap.value[getRowHash(row)]?.[colName];
              const currentValue = row[colName];
              if (currentValue !== originalValue) {
                update[colName] = normalizeDataType(
                  currentValue,
                  column.type as string
                );
              }
            });
            if (primaryColumnName.value) {
              updateFilter[primaryColumnName.value] =
                originalTableDataMap.value[getRowHash(row)][
                  primaryColumnName.value
                ];
            } else {
              throw new Error('Primary column not found');
            }
            return { filter: updateFilter, update, status: 'updated' };
          case 'deleted':
            const deleteFilter: any = {};
            if (primaryColumnName.value) {
              deleteFilter[primaryColumnName.value] =
                originalTableDataMap.value[getRowHash(row)][
                  primaryColumnName.value
                ];
            } else {
              throw new Error('Primary column not found');
            }
            return { filter: deleteFilter, status: 'deleted' };
        }
      }),
  });
  await getTableData();
};

const hasChanges = computed(() => {
  return tableData.value.some(row => {
    return getDataRowStatus(row) !== undefined;
  });
});

const selectedRows = ref<TableAnyRowData[]>([]);

defineExpose({
  rollback,
  commit,
  hasChanges,
});

defineOptions({ name: 'ClDatabaseTableDetailData' });
</script>

<template>
  <cl-edit-table
    ref="tableRef"
    :key="JSON.stringify([tableData, tableColumns])"
    :columns="tableColumns"
    :data="tableData"
    :page="tablePagination.page"
    :page-size="tablePagination.size"
    :total="tableTotal"
    :row-style="dataRowStyle"
    :cell-style="dataRowCellStyle"
    :cell-class-name="dataRowCellClassName"
    hide-default-actions
    selectable
    embedded
    @add="onAddDataRow"
    @pagination-change="onPaginationChange"
    @selection-change="(selection: TableAnyRowData[]) => selectedRows = selection"
  >
    <template #actions-prefix>
      <cl-fa-icon-button
        type="primary"
        :icon="['fa', 'plus']"
        :tooltip="t('common.actions.add')"
        size="small"
        @click="onAddDataRow"
      />
      <cl-fa-icon-button
        type="danger"
        :icon="['fa', 'trash-alt']"
        :tooltip="t('common.actions.delete')"
        size="small"
        :disabled="selectedRows.length === 0"
        @click="onDeleteDataRows"
      />
    </template>
  </cl-edit-table>
</template>
