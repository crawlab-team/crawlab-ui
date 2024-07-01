import { Store } from 'vuex';
declare const useTaskService: (store: Store<RootStoreState>) => Services<Task>;
export default useTaskService;
