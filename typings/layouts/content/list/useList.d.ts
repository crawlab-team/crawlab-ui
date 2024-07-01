import { Store } from 'vuex';
export declare const getFilterConditions: (column: TableColumn, filter: TableHeaderDialogFilterData) => FilterConditionData[];
declare const useList: <T = any>(ns: ListStoreNamespace, store: Store<RootStoreState>, opts?: UseListOptions<T>) => ListLayoutComponentData;
export default useList;
