import { Store } from 'vuex';
type Plugin = CPlugin;
declare const usePluginService: (store: Store<RootStoreState>) => Services<Plugin>;
export default usePluginService;
