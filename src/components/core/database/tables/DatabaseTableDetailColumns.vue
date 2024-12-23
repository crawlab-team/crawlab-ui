<script setup lang="tsx">
import { computed, type CSSProperties } from 'vue';
import type {
  AutocompleteFetchSuggestionsCallback,
  CellCls,
  CellStyle,
  ColumnStyle,
} from 'element-plus';
import { ElCheckbox } from 'element-plus';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table/defaults';
import {
  ClContextMenu,
  ClContextMenuList,
  ClIcon,
  ClTableEditCell,
} from '@/components';
import { translate } from '@/utils';
import { useDatabaseDetail } from '@/views';
import useRequest from '@/services/request';
import { getColumnStatus, canColumnAutoIncrement } from '@/utils/database';

const internalTable = defineModel<DatabaseTable>();

const props = defineProps<{
  loading?: boolean;
  activeTable?: DatabaseTable;
}>();

const emit = defineEmits<{
  (e: 'change', value: DatabaseTable): void;
}>();

const t = translate;

const { get } = useRequest();

const { activeId } = useDatabaseDetail();

const onAddColumn = (column?: DatabaseColumn, before?: boolean) => {
  const newColumn: DatabaseColumn = {
    name: '',
    type: '',
    not_null: true,
    default: '',
    status: 'new',
  };
  if (!internalTable.value) return;
  if (column === undefined) {
    internalTable.value?.columns?.push(newColumn);
  } else {
    const idx = internalTable.value?.columns?.findIndex(
      c => c.name === column.name
    );
    if (typeof idx === 'undefined') return;
    if (before) {
      internalTable.value?.columns?.splice(idx, 0, newColumn);
    } else {
      internalTable.value?.columns?.splice(idx + 1, 0, newColumn);
    }
  }
  emit('change', internalTable.value);
};

const onDeleteColumn = (column: DatabaseColumn) => {
  if (!internalTable.value) return;
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
  emit('change', internalTable.value);
};

const onRevertColumn = (column: DatabaseColumn) => {
  if (!internalTable.value) return;
  column.status = undefined;
  emit('change', internalTable.value);
};

const columnsTableColumns = computed<TableColumns<DatabaseColumn>>(() => {
  if (!internalTable.value) return [];
  return [
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
            <ClIcon
              icon={['fa', 'minus']}
              onClick={() => onDeleteColumn(row)}
            />
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
      noPadding: true,
      value: (row: DatabaseColumn) => (
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
      label: t('components.database.databases.table.columns.type'),
      width: 200,
      noPadding: true,
      value: (row: DatabaseColumn) => (
        <ClTableEditCell
          modelValue={row.type}
          isEdit={row.isEdit?.type}
          autocomplete
          required
          fetchSuggestions={async (
            query: string,
            cb: AutocompleteFetchSuggestionsCallback
          ) => {
            const res = await get(
              `/databases/${activeId.value}/columns/types?query=${query}`
            );
            cb(
              res.data?.map((type: string) => ({ value: type, label: type })) ||
                []
            );
          }}
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
      key: 'not_null',
      label: t('components.database.databases.table.columns.notNull'),
      width: 120,
      value: (row: DatabaseColumn) => (
        <ElCheckbox
          modelValue={row.not_null}
          onChange={(val: boolean) => {
            if (!internalTable.value) return;
            row.not_null = val;
            emit('change', internalTable.value);
          }}
        />
      ),
    },
    {
      key: 'default',
      label: t('components.database.databases.table.columns.default'),
      width: 200,
      noPadding: true,
      value: (row: DatabaseColumn) => (
        <ClTableEditCell
          modelValue={row.default}
          isEdit={row.isEdit?.default}
          onChange={(val: string) => {
            if (!internalTable.value) return;
            row.default = val;
            emit('change', internalTable.value);
          }}
          onEdit={(val: boolean) => {
            if (!row.isEdit) row.isEdit = {};
            row.isEdit.default = val;
          }}
        />
      ),
    },
    {
      key: 'primary',
      label: t('components.database.databases.table.columns.primary'),
      width: 100,
      value: (row: DatabaseColumn) => (
        <ElCheckbox
          modelValue={row.primary}
          onChange={(val: boolean) => {
            if (!internalTable.value) return;
            row.primary = val;
            if (canColumnAutoIncrement(row)) {
              row.auto_increment = true;
            }
            emit('change', internalTable.value);
          }}
        />
      ),
    },
    {
      key: 'auto_increment',
      label: t('components.database.databases.table.columns.autoIncrement'),
      width: 100,
      value: (row: DatabaseColumn) => (
        <ElCheckbox
          disabled={!canColumnAutoIncrement(row)}
          modelValue={row.auto_increment}
          onChange={(val: boolean) => {
            if (!internalTable.value) return;
            row.auto_increment = val;
            emit('change', internalTable.value);
          }}
        />
      ),
    },
  ];
});

const columnsTableData = computed<TableData<DatabaseColumn>>(() => {
  return internalTable.value?.columns || [];
});

const columnRowStyle: ColumnStyle<DatabaseColumn> = ({
  row,
}): CSSProperties => {
  let backgroundColor: string | undefined = undefined;
  let color: string | undefined = undefined;
  const status = getColumnStatus(row, props.activeTable);
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

const isColumnCellUpdated = (
  row: DatabaseColumn,
  column: TableColumnCtx<DatabaseColumn>
) => {
  if (column.columnKey === 'actions') {
    return false;
  }
  const originalColumn = props.activeTable?.columns?.find(
    c => c.hash === row.hash
  );
  if (!originalColumn) return false;
  return (
    row[column.columnKey as keyof DatabaseColumn] !==
    originalColumn[column.columnKey as keyof DatabaseColumn]
  );
};

const columnCellStyle: CellStyle<DatabaseColumn> = ({ row, column }) => {
  if (isColumnCellUpdated(row, column)) {
    return {
      fontWeight: 'bold',
    };
  }
  return {};
};

const columnCellClassName: CellCls<DatabaseColumn> = ({ row, column }) => {
  if (isColumnCellUpdated(row, column)) {
    return 'updated';
  }
  return '';
};

defineOptions({ name: 'ClDatabaseTableDetailColumns' });
</script>

<template>
  <cl-edit-table
    :loading="loading"
    :key="JSON.stringify(internalTable)"
    :columns="columnsTableColumns"
    :data="columnsTableData"
    :row-style="columnRowStyle"
    :cell-style="columnCellStyle"
    :cell-class-name="columnCellClassName"
    embedded
    hide-footer
    @add="onAddColumn"
  />
</template>
