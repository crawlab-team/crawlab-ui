import { Ref } from 'vue';
import { Table } from 'element-plus/lib/components/table/src/table/defaults';

declare const useColumns: (
  props: TableProps,
  table: Ref<Table<any> | undefined>,
  wrapper: Ref<Element>
) => {
  internalSelectedColumnKeys: Ref<string[]>;
  columnsMap: import('vue').ComputedRef<TableColumnsMap<any>>;
  columnsTransferVisible: Ref<boolean>;
  selectedColumns: import('vue').ComputedRef<TableColumn<any>[]>;
  onShowColumnsTransfer: () => void;
  onHideColumnsTransfer: () => void;
  onColumnsChange: (value: string[]) => void;
};
export default useColumns;
