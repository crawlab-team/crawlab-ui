import { Ref } from '@vue/runtime-dom';
import { Table } from 'element-plus/lib/components/table/src/table/defaults';
declare const useColumns: (props: TableProps, table: Ref<Table<any> | undefined>, wrapper: Ref<Element>) => {
    internalSelectedColumnKeys: Ref<string[]>;
    columnsMap: import("@vue/reactivity").ComputedRef<TableColumnsMap<any>>;
    columnsTransferVisible: Ref<boolean>;
    selectedColumns: import("@vue/reactivity").ComputedRef<TableColumn<any>[]>;
    onShowColumnsTransfer: () => void;
    onHideColumnsTransfer: () => void;
    onColumnsChange: (value: string[]) => void;
};
export default useColumns;
