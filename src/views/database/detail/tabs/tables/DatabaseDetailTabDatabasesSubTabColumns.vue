<script setup lang="tsx">
import { computed, type CSSProperties, onBeforeMount, ref, watch } from 'vue';
import type {
  AutocompleteFetchSuggestionsCallback,
  CellStyle,
  ColumnStyle,
} from 'element-plus';
import {
  ClContextMenu,
  ClContextMenuList,
  ClIcon,
  ClTableEditCell,
} from '@/components';
import { translate } from '@/utils';
import { useStore } from 'vuex';
import { useDatabaseDetail } from '@/views';
import useRequest from '@/services/request';

const t = translate;

const { get } = useRequest();

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const { activeId } = useDatabaseDetail();

const activeTable = computed(() => state.activeTable);
const internalTable = ref<DatabaseTable | undefined>(activeTable.value);
watch(activeTable, val => {
  internalTable.value = val;
});
onBeforeMount(() => {
  store.dispatch(`${ns}/getTable`, { id: activeId.value });
});

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
    noPadding: true,
    value: (row: DatabaseColumn) => (
      <ClTableEditCell
        modelValue={row.name}
        onChange={(val: string) => {
          row.name = val;
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
        autocomplete
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
          row.type = val;
        }}
      />
    ),
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

const getColumnStatus = (column: DatabaseColumn) => {
  if (column.status && column.status !== 'updated') return column.status;
  const hasColumn = activeTable.value?.columns?.some(
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
    return {};
  }
  const originalColumn = activeTable.value?.columns?.find(
    c => c.hash === row.hash
  );
  if (!originalColumn) return {};
  if (
    row[column.columnKey as keyof DatabaseColumn] ===
    originalColumn[column.columnKey as keyof DatabaseColumn]
  ) {
    return {};
  }
  return {
    fontWeight: 'bold',
  };
};

defineOptions({ name: 'ClDatabaseDetailTabDatabasesSubTabColumns' });
</script>

<template>
  <cl-table
    :loading="commitLoading"
    :key="JSON.stringify(internalTable)"
    :row-key="(row: DatabaseColumn) => JSON.stringify(row)"
    :columns="columnsTableColumns"
    :data="columnsTableData"
    :row-style="columnRowStyle"
    :cell-style="columnCellStyle"
    hide-footer
  />
</template>

<style scoped lang="scss"></style>
