import { Ref } from 'vue';
import { Store } from 'vuex';
export declare const getDefaultUseListOptions: <T = any>(navActions: Ref<ListActionGroup[]>, tableColumns: Ref<TableColumns<T>>) => UseListOptions<T>;
export declare const setupGetAllList: (store: Store<RootStoreState>, allListNamespaces: ListStoreNamespace[]) => void;
export declare const setupListComponent: (ns: ListStoreNamespace, store: Store<RootStoreState>, allListNamespaces?: ListStoreNamespace[]) => void;
export declare const prependAllToSelectOptions: (options: SelectOption[]) => SelectOption[];
export declare const onListFilterChangeByKey: (store: Store<RootStoreState>, ns: ListStoreNamespace, key: string, op?: string) => (value: string) => Promise<void>;
