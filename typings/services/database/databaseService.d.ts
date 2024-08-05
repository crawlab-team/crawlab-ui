import { Store } from 'vuex';

declare const useDataSourceService: (
  store: Store<RootStoreState>
) => Services<Database>;
export default useDataSourceService;
