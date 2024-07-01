import { Store } from 'vuex';
declare const useFileService: <T>(ns: ListStoreNamespace, store: Store<RootStoreState>) => FileServices<T>;
export default useFileService;
