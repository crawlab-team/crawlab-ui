import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';

declare global {
  interface CommonStoreModule extends Module<CommonStoreState, RootStoreState> {
    getters: CommonStoreGetters;
    mutations: CommonStoreMutations;
    actions: CommonStoreActions;
  }

  interface CommonStoreState {
    lang?: Lang;
    systemInfo?: SystemInfo;
    me?: User;
  }

  interface CommonStoreGetters
    extends GetterTree<CommonStoreState, RootStoreState> {
    isPro: StoreGetter<CommonStoreState, boolean>;
  }

  interface CommonStoreMutations extends MutationTree<CommonStoreState> {
    setLang: StoreMutation<CommonStoreState, Lang>;
    setSystemInfo: StoreMutation<CommonStoreState, SystemInfo>;
    setMe: StoreMutation<CommonStoreState, User>;
    resetMe: StoreMutation<CommonStoreState>;
  }

  interface CommonStoreActions
    extends ActionTree<CommonStoreState, RootStoreState> {
    getSystemInfo: StoreAction<CommonStoreState>;
    getMe: StoreAction<CommonStoreState>;
    putMe: StoreAction<CommonStoreState, User>;
    changeMyPassword: StoreAction<UserStoreState, { password: string }>;
  }
}
