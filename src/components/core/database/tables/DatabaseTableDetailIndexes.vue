<script setup lang="tsx">
import { computed, type CSSProperties, ref } from 'vue';
import type { CellCls, CellStyle, ColumnStyle } from 'element-plus';
import { ElCheckbox } from 'element-plus';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table/defaults';
import { translate, plainClone } from '@/utils';
import { getIndexStatus } from '@/utils/database';
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

const t = translate;

const editColumnsDialogVisible = ref(false);

const onAddIndex = (index?: DatabaseIndex, before?: boolean) => {
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
};

const onDeleteIndex = (index: DatabaseIndex) => {
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
};

const onRevertIndex = (index: DatabaseIndex) => {
  index.status = undefined;
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
    key: 'type',
    label: t('components.database.databases.table.indexes.type'),
    width: 200,
    noPadding: true,
    value: (row: DatabaseIndex) => (
      <ClTableEditCell
        modelValue={row.type}
        isEdit={row.isEdit?.type}
        onChange={(val: string) => {
          row.type = val;
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
    value: (row: DatabaseIndex) => (
      <ClTableEditCell
        modelValue={row.columns?.map(c => c.name).join(',')}
        required
        isEdit={false}
        onEdit={() => {
          activeIndex.value = plainClone(row);
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
                  activeIndex.value = plainClone(row);
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
          row.unique = val;
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
  indexColumn: DatabaseIndexColumn,
  before: boolean
) => {
  if (!activeIndex.value) return;
  const idx = activeIndex.value?.columns?.findIndex(
    i => i.name === indexColumn.name
  );
  if (typeof idx === 'undefined') return;
  const newIndexColumn: DatabaseIndexColumn = {
    name: '',
    order: 1,
    isEdit: { name: true },
  };
  if (before) {
    activeIndex.value?.columns?.splice(idx, 0, newIndexColumn);
  } else {
    activeIndex.value?.columns?.splice(idx + 1, 0, newIndexColumn);
  }
};
const onDeleteIndexColumn = (indexColumn: DatabaseIndexColumn) => {
  if (!activeIndex.value) return;
  const idx = activeIndex.value?.columns?.findIndex(
    i => i.name === indexColumn.name
  );
  if (typeof idx === 'undefined') return;
  activeIndex.value?.columns?.splice(idx, 1);
};
const activeIndex = ref<DatabaseIndex>();
const activeIndexColumnsColumns = computed<TableColumns<DatabaseIndexColumn>>(
  () => [
    {
      key: 'actions',
      width: 80,
      label: t('components.table.columns.actions'),
      value: (row: DatabaseIndexColumn) => (
        <ClEditTableActionCell
          onAddBefore={() => onAddIndexColumn(row, true)}
          onAddAfter={() => onAddIndexColumn(row, false)}
          onDelete={() => onDeleteIndexColumn(row)}
        />
      ),
    },
    {
      key: 'name',
      width: 200,
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
      width: 200,
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
  return activeIndex.value?.columns || [];
});

defineOptions({ name: 'ClDatabaseTableDetailIndexes' });
</script>

<template>
  <cl-edit-table
    :loading="loading"
    :key="JSON.stringify(internalTable)"
    :row-key="(row: DatabaseIndex) => JSON.stringify(row)"
    :columns="indexesTableColumns"
    :data="indexesTableData"
    :row-style="indexRowStyle"
    :cell-style="indexCellStyle"
    :cell-class-name="indexCellClassName"
    hide-footer
  />

  <cl-dialog
    :visible="editColumnsDialogVisible"
    @confirm="
      () => {
        if (!activeIndex) return;
        const index = internalTable?.indexes?.find(
          i => i.name === activeIndex?.name
        );
        if (!index) return;
        index.columns = activeIndex.columns;
        editColumnsDialogVisible = false;
      }
    "
    @close="
      () => {
        activeIndex = undefined;
        editColumnsDialogVisible = false;
      }
    "
  >
    <cl-edit-table
      :row-key="(row: DatabaseIndexColumn) => JSON.stringify(row)"
      :columns="activeIndexColumnsColumns"
      :data="activeIndexColumnsData"
      hide-footer
    />
  </cl-dialog>
</template>
