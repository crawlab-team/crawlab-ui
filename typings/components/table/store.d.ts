import { Ref } from '@vue/runtime-dom';
import { Table } from 'element-plus/lib/components/table/src/table/defaults';
declare const useStore: (table: Ref<Table<any> | undefined>) => {
    store: import("@vue/reactivity").ComputedRef<TableStore | undefined>;
};
export default useStore;
