import { computed, onBeforeMount, onMounted, ref, Ref } from 'vue';
import { Table } from 'element-plus/lib/components/table/src/table/defaults';
import { cloneArray, plainClone } from '@/utils/object';
import useStore from '@/components/ui/table/store';
import { getColumnWidth, getTableWidth } from '@/utils/table';

const useColumns = (
  props: TableProps,
  table: Ref<Table<any> | undefined>,
  wrapper: Ref<Element>
) => {
  const { columns } = props;

  const { store } = useStore(table);

  const columnsTransferVisible = ref<boolean>(false);

  const internalSelectedColumnKeys = ref<string[]>([]);

  const columnsMap = computed<TableColumnsMap>(() => {
    const map = {} as TableColumnsMap;
    columns.forEach(c => {
      map[c.key] = c;
    });
    return map;
  });

  const columnsCtx = computed<TableColumnCtx[]>(() => {
    return table.value?.store.states.columns.value || [];
  });

  const columnCtxMap = computed<TableColumnCtxMap>(() => {
    const map = {} as TableColumnCtxMap;
    columnsCtx.value.forEach(c => {
      map[c.columnKey] = c;
    });
    return map;
  });

  const selectedColumns = computed<TableColumn[]>(() => {
    return internalSelectedColumnKeys.value.map(key => columnsMap.value[key]);
  });

  const defaultSelectedColumns = computed<TableColumn[]>(() => {
    return columns.filter(d => !d.defaultHidden);
  });

  const onShowColumnsTransfer = () => {
    columnsTransferVisible.value = true;
  };

  const onHideColumnsTransfer = () => {
    columnsTransferVisible.value = false;
  };

  const isColumnsEqual = (columnKeys: string[]) => {
    const columnKeysSorted = cloneArray(columnKeys).sort().join(',');
    const internalSelectedColumnKeysSorted = cloneArray(
      internalSelectedColumnKeys.value
    )
      .sort()
      .join(',');
    return columnKeysSorted === internalSelectedColumnKeysSorted;
  };

  const updateColumns = (columnKeys?: string[]) => {
    if (!store.value) return;

    if (!columnKeys) {
      columnKeys = selectedColumns.value.map(d => d.key);
    }

    // selection column keys
    const selectionColumnKeys = columnsCtx.value
      .filter(d => d.type === 'selection')
      .map(d => d.columnKey);

    // table width
    const tableWidth = getTableWidth(wrapper.value);

    // table width
    let tableFixedTotalWidth = 0;
    columns
      .map(d => getColumnWidth(d) as number)
      .filter(w => !!w)
      .forEach((w: number) => {
        tableFixedTotalWidth += w;
      });

    // auto width
    const autoWidth = tableWidth
      ? tableWidth - tableFixedTotalWidth - 40 - 12
      : 0;

    // columns to update
    const columnsToUpdate = selectionColumnKeys.concat(columnKeys).map(key => {
      const columnCtx = columnCtxMap.value[key];
      const column = columnsMap.value[key];
      if (column && column.width === 'auto') {
        if (autoWidth) {
          columnCtx.width = autoWidth > 400 ? autoWidth : 400;
        }
      }
      return columnCtx;
    });

    // update columns
    if (isColumnsEqual(columnKeys)) {
      store.value?.commit('setColumns', columnsToUpdate);
      store.value?.updateColumns();
    }
    internalSelectedColumnKeys.value = columnKeys;
  };

  const onColumnsChange = (value: string[]) => {
    updateColumns(value);
  };

  const initColumns = () => {
    if (defaultSelectedColumns.value.length < columns.length) {
      internalSelectedColumnKeys.value = plainClone(
        defaultSelectedColumns.value.map(d => d.key)
      );
    } else {
      internalSelectedColumnKeys.value = cloneArray(columns.map(d => d.key));
    }
  };

  onBeforeMount(() => {
    initColumns();
  });

  onMounted(() => {
    setTimeout(updateColumns, 0);
  });

  return {
    internalSelectedColumnKeys,
    columnsMap,
    columnsTransferVisible,
    selectedColumns,
    onShowColumnsTransfer,
    onHideColumnsTransfer,
    onColumnsChange,
  };
};

export default useColumns;
