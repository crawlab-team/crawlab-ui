import { Store } from 'vuex';
declare const useUserService: (store: Store<RootStoreState>) => Services<User>;
export default useUserService;
