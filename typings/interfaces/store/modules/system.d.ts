import { GetterTree, Module, MutationTree } from 'vuex';

declare global {
  interface SystemStoreModule extends Module<SystemStoreState, RootStoreState> {
    getters: SystemStoreGetters;
    mutations: SystemStoreMutations;
    actions: SystemStoreActions;
  }

  interface SystemStoreState {
    settings: Record<string, Setting>;
  }

  interface SystemStoreGetters
    extends GetterTree<SystemStoreState, RootStoreState> {}

  interface SystemStoreMutations extends MutationTree<SystemStoreState> {
    setSetting: StoreMutation<
      SystemStoreState,
      { key: string; value: Setting }
    >;
    resetSetting: StoreMutation<SystemStoreState, { key: string }>;
    setSettings: StoreMutation<
      SystemStoreState,
      { settings: Record<string, Setting> }
    >;
    resetSettings: StoreMutation<SystemStoreState>;
  }

  interface SystemStoreActions extends BaseStoreActions {
    getSetting: StoreAction<SystemStoreState, { key: string }>;
    saveSetting: StoreAction<SystemStoreState, { key: string; value: Setting }>;
  }
}
