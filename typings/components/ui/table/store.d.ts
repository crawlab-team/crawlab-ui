import { Ref } from 'vue';
import { Table } from 'element-plus/lib/components/table/src/table/defaults';

declare const useStore: (table: Ref<Table<any> | undefined>) => {
  store: import('vue').ComputedRef<TableStore | undefined>;
};
export default useStore;
