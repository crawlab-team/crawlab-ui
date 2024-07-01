import { Store } from 'vuex';
declare const useProjectService: (store: Store<RootStoreState>) => Services<Project>;
export default useProjectService;
