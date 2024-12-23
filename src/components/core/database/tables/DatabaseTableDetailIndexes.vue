<script setup lang="tsx">
import { computed, type CSSProperties, ref } from 'vue';
import type { CellCls, CellStyle, ColumnStyle } from 'element-plus';
import { ElCheckbox } from 'element-plus';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table/defaults';
import { translate, plainClone } from '@/utils';
import {
  getDefaultIndexName,
  getIndexStatus,
  isDefaultIndexName,
} from '@/utils/database';
import {
  ClIcon,
  ClTag,
  ClTableEditCell,
  ClEditTableActionCell,
} from '@/components';

const internalTable = defineModel<DatabaseTable>();

const props = defineProps<{
  loading?: boolean;
  activeTable?: DatabaseTable;
}>();

const emit = defineEmits<{
  (e: 'change', value: DatabaseTable): void;
}>();

const t = translate;

const editColumnsDialogVisible = ref(false);

const onAddIndex = (index?: DatabaseIndex, before?: boolean) => {
  if (!internalTable.value) return;
  const newIndex: DatabaseIndex = {
    name: '',
    type: '',
    columns: [],
    unique: false,
    status: 'new',
  };
  if (index === undefined) {
    internalTable.value?.indexes?.push(newIndex);
  } else {
    const idx = internalTable.value?.indexes?.findIndex(
      i => i.name === index.name
    );
    if (typeof idx === 'undefined') return;
    if (before) {
      internalTable.value?.indexes?.splice(idx, 0, newIndex);
    } else {
      internalTable.value?.indexes?.splice(idx + 1, 0, newIndex);
    }
  }
  emit('change', internalTable.value);
};

const onDeleteIndex = (index: DatabaseIndex) => {
  if (!internalTable.value) return;
  if (index.status === 'new') {
    const idx = internalTable.value?.columns?.findIndex(
      i => i.name === index.name
    );
    if (typeof idx === 'undefined') return;
    internalTable.value?.columns?.splice(idx, 1);
    return;
  } else {
    index.status = 'deleted';
  }
  emit('change', internalTable.value);
};

const onRevertIndex = (index: DatabaseIndex) => {
  if (!internalTable.value) return;
  index.status = undefined;
  emit('change', internalTable.value);
};

const indexesTableColumns = computed<TableColumns<DatabaseIndex>>(() => [
  {
    key: 'actions',
    label: t('components.table.columns.actions'),
    width: 80,
    value: (row: DatabaseIndex) => (
      <ClEditTableActionCell
        deleted={row.status === 'deleted'}
        onAddBefore={() => onAddIndex(row, true)}
        onAddAfter={() => onAddIndex(row, false)}
        onDelete={() => onDeleteIndex(row)}
        onRevert={() => onRevertIndex(row)}
      />
    ),
  },
  {
    key: 'name',
    label: t('components.database.databases.table.indexes.name'),
    width: 200,
    noPadding: true,
    value: (row: DatabaseIndex) => (
      <ClTableEditCell
        modelValue={row.name}
        isEdit={row.isEdit?.name}
        required
        onChange={(val: string) => {
          if (!internalTable.value) return;
          row.name = val;
          emit('change', internalTable.value);
        }}
        onEdit={(val: boolean) => {
          if (!row.isEdit) row.isEdit = {};
          row.isEdit.name = val;
        }}
      />
    ),
  },
  {
    key: 'type',
    label: t('components.database.databases.table.indexes.type'),
    width: 200,
    noPadding: true,
    value: (row: DatabaseIndex) => (
      <ClTableEditCell
        modelValue={row.type}
        isEdit={row.isEdit?.type}
        onChange={(val: string) => {
          if (!internalTable.value) return;
          row.type = val;
          emit('change', internalTable.value);
        }}
        onEdit={(val: boolean) => {
          if (!row.isEdit) row.isEdit = {};
          row.isEdit.type = val;
        }}
      />
    ),
  },
  {
    key: 'columns',
    label: t('components.database.databases.table.indexes.columns'),
    width: 200,
    noPadding: true,
    value: (row: DatabaseIndex, rowIndex: number) => (
      <ClTableEditCell
        modelValue={row.columns?.map(c => c.name).join(',')}
        required
        isEdit={false}
        onEdit={() => {
          activeIndexColumnsRowIndex.value = rowIndex;
          activeIndexColumns.value = plainClone(row.columns);
          editColumnsDialogVisible.value = true;
        }}
      >
        {{
          default: () =>
            row.columns.map(c => (
              <ClTag
                clickable
                icon={c.order > 0 ? ['fa', 'arrow-up'] : ['fa', 'arrow-down']}
                label={c.name}
                onClick={() => {
                  activeIndexColumnsRowIndex.value = rowIndex;
                  activeIndexColumns.value = plainClone(row.columns);
                  editColumnsDialogVisible.value = true;
                }}
              >
                {{
                  tooltip: () => (
                    <div>
                      <div>
                        <label style={{ marginRight: '5px' }}>
                          {t(
                            'components.database.databases.table.indexes.column.name'
                          )}
                          :
                        </label>
                        {c.name}
                      </div>
                      <div>
                        <label style={{ marginRight: '5px' }}>
                          {t(
                            'components.database.databases.table.indexes.column.order'
                          )}
                          :
                        </label>
                        {t(`common.order.${c.order > 0 ? 'asc' : 'desc'}`)}
                      </div>
                    </div>
                  ),
                }}
              </ClTag>
            )),
        }}
      </ClTableEditCell>
    ),
  },
  {
    key: 'unique',
    label: t('components.database.databases.table.indexes.unique'),
    width: 120,
    value: (row: DatabaseIndex) => (
      <ElCheckbox
        modelValue={row.unique}
        onChange={(val: boolean) => {
          if (!internalTable.value) return;
          row.unique = val;
          emit('change', internalTable.value);
        }}
      />
    ),
  },
]);

const indexesTableData = computed<TableData<DatabaseIndex>>(() => {
  return internalTable.value?.indexes || [];
});

const indexRowStyle: ColumnStyle<DatabaseIndex> = ({ row }): CSSProperties => {
  let backgroundColor: string | undefined = undefined;
  let color: string | undefined = undefined;
  const status = getIndexStatus(row, props.activeTable);
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

const isIndexCellUpdated = (
  row: DatabaseIndex,
  column: TableColumnCtx<DatabaseIndex>
) => {
  if (column.columnKey === 'actions') {
    return false;
  }
  const originalIndex = props.activeTable?.indexes?.find(
    c => c.hash === row.hash
  );
  if (!originalIndex) return false;
  return (
    JSON.stringify(row[column.columnKey as keyof DatabaseIndex]) !==
    JSON.stringify(originalIndex[column.columnKey as keyof DatabaseIndex])
  );
};

const indexCellStyle: CellStyle<DatabaseIndex> = ({ row, column }) => {
  if (isIndexCellUpdated(row, column)) {
    return {
      fontWeight: 'bold',
    };
  }
  return {};
};

const indexCellClassName: CellCls<DatabaseIndex> = ({ row, column }) => {
  if (isIndexCellUpdated(row, column)) {
    return 'updated';
  }
  return '';
};

const onAddIndexColumn = (
  indexColumn?: DatabaseIndexColumn,
  before?: boolean
) => {
  if (!internalTable.value) return;
  const newIndexColumn: DatabaseIndexColumn = {
    name: '',
    order: 1,
    isEdit: {
      name: true,
    },
  };
  const idx = activeIndexColumns.value?.findIndex(
    i => i.name === indexColumn?.name
  );
  if (typeof idx === 'undefined') {
    activeIndexColumns.value?.push(newIndexColumn);
    return;
  }
  if (before) {
    activeIndexColumns.value?.splice(idx, 0, newIndexColumn);
  } else {
    activeIndexColumns.value?.splice(idx + 1, 0, newIndexColumn);
  }
  emit('change', internalTable.value);
};
const onDeleteIndexColumn = (rowIndex: number) => {
  activeIndexColumns.value?.splice(rowIndex, 1);
};
const activeIndexColumnsRowIndex = ref<number>();
const activeIndexColumns = ref<DatabaseIndexColumn[]>();
const activeIndexColumnsColumns = computed<TableColumns<DatabaseIndexColumn>>(
  () => [
    {
      key: 'actions',
      width: 80,
      label: t('components.table.columns.actions'),
      value: (row: DatabaseIndexColumn, rowIndex: number) => (
        <ClEditTableActionCell
          onAddBefore={() => onAddIndexColumn(row, true)}
          onAddAfter={() => onAddIndexColumn(row, false)}
          onDelete={() => onDeleteIndexColumn(rowIndex)}
        />
      ),
    },
    {
      key: 'name',
      label: t('components.database.databases.table.indexes.column.name'),
      noPadding: true,
      value: (row: DatabaseIndexColumn) => (
        <ClTableEditCell
          modelValue={row.name}
          isEdit={row.isEdit?.name}
          required
          select
          options={
            internalTable.value?.columns?.map(c => ({
              value: c.name,
              label: c.name,
            })) || []
          }
          onChange={(val: string) => {
            row.name = val;
          }}
          onEdit={(val: boolean) => {
            if (!row.isEdit) row.isEdit = {};
            row.isEdit.name = val;
          }}
        />
      ),
    },
    {
      key: 'order',
      label: t('components.database.databases.table.indexes.column.order'),
      value: (row: DatabaseIndexColumn) => (
        <ElCheckbox
          modelValue={row.order > 0}
          label={t(`common.order.${row.order > 0 ? 'asc' : 'desc'}`)}
          onChange={(val: boolean) => {
            row.order = val ? 1 : -1;
          }}
        />
      ),
    },
  ]
);
const activeIndexColumnsData = computed<TableData<DatabaseIndexColumn>>(() => {
  return activeIndexColumns.value || [];
});
const onActiveIndexColumnsDialogConfirm = () => {
  if (!internalTable.value) return;
  if (typeof activeIndexColumnsRowIndex.value === 'undefined') return;
  const index =
    internalTable.value?.indexes?.[activeIndexColumnsRowIndex.value];
  if (!index) return;

  // Update name
  if (
    !index.name ||
    isDefaultIndexName(internalTable.value as DatabaseTable, index)
  ) {
    index.name = getDefaultIndexName(
      internalTable.value as DatabaseTable,
      activeIndexColumns.value || []
    );
  }

  // Update columns
  index.columns = plainClone(activeIndexColumns.value || []);

  editColumnsDialogVisible.value = false;

  emit('change', internalTable.value);
};
const onActiveIndexColumnsDialogClose = () => {
  activeIndexColumnsRowIndex.value = undefined;
  activeIndexColumns.value = undefined;
  editColumnsDialogVisible.value = false;
};

defineOptions({ name: 'ClDatabaseTableDetailIndexes' });
</script>

<template>
  <cl-edit-table
    :loading="loading"
    :key="JSON.stringify(internalTable)"
    :columns="indexesTableColumns"
    :data="indexesTableData"
    :row-style="indexRowStyle"
    :cell-style="indexCellStyle"
    :cell-class-name="indexCellClassName"
    embedded
    hide-footer
    @add="onAddIndex"
  />

  <cl-dialog
    :title="t('components.database.databases.table.actions.editIndexColumns')"
    :visible="editColumnsDialogVisible"
    @confirm="onActiveIndexColumnsDialogConfirm"
    @close="onActiveIndexColumnsDialogClose"
  >
    <cl-edit-table
      :key="JSON.stringify([activeIndexColumnsRowIndex, activeIndexColumns])"
      :columns="activeIndexColumnsColumns"
      :data="activeIndexColumnsData"
      fit
      hide-footer
      @add="onAddIndexColumn"
    />
  </cl-dialog>
</template>
