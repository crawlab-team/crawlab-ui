import { GetterTree, Module, MutationTree } from 'vuex';

declare global {
  interface SystemStoreModule extends Module<SystemStoreState, RootStoreState> {
    getters: SystemStoreGetters;
    mutations: SystemStoreMutations;
    actions: SystemStoreActions;
  }

  interface SystemStoreState {
    siteTitle: Setting;
  }

  interface SystemStoreGetters
    extends GetterTree<SystemStoreState, RootStoreState> {}

  interface SystemStoreMutations extends MutationTree<SystemStoreState> {
    setSiteTitle: StoreMutation<SystemStoreState, Setting>;
  }

  interface SystemStoreActions extends BaseStoreActions {
    getSiteTitle: StoreAction<SystemStoreState>;
    saveSiteTitle: StoreAction<SystemStoreState>;
  }
}
