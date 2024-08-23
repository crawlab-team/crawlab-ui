import { GetterTree, Module, MutationTree } from 'vuex';

declare global {
  interface SystemStoreModule extends Module<SystemStoreState, RootStoreState> {
    getters: SystemStoreGetters;
    mutations: SystemStoreMutations;
    actions: SystemStoreActions;
  }

  interface SystemStoreState {
    customize: Setting;
  }

  interface SystemStoreGetters
    extends GetterTree<SystemStoreState, RootStoreState> {}

  interface SystemStoreMutations extends MutationTree<SystemStoreState> {
    setCustomize: StoreMutation<SystemStoreState, Setting>;
  }

  interface SystemStoreActions extends BaseStoreActions {
    getCustomize: StoreAction<SystemStoreState>;
    saveCustomize: StoreAction<SystemStoreState>;
  }
}
