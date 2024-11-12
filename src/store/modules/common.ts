import { plainClone } from '@/utils/object';
import useRequest from '@/services/request';

const { get, put } = useRequest();

export default {
  namespaced: true,
  state: {
    lang: localStorage.getItem('lang') || 'en',
    systemInfo: JSON.parse(localStorage.getItem('systemInfo') || '{}'),
    me: undefined,
  } as CommonStoreState,
  getters: {
    isPro: (state: CommonStoreState) => {
      return state.systemInfo?.edition === 'global.edition.pro';
    },
  } as CommonStoreGetters,
  mutations: {
    setLang: (state: CommonStoreState, lang: Lang) => {
      state.lang = lang;
    },
    setSystemInfo: (state: CommonStoreState, info: SystemInfo) => {
      state.systemInfo = plainClone(info);
      localStorage.setItem('systemInfo', JSON.stringify(info));
    },
    setMe: (state: CommonStoreState, user: User) => {
      state.me = user;
    },
    resetMe: (state: CommonStoreState) => {
      state.me = undefined;
    },
  } as CommonStoreMutations,
  actions: {
    getSystemInfo: async ({ commit }: StoreActionContext) => {
      const res = await get('/system-info');
      commit('setSystemInfo', res.data);
    },
    getMe: async ({ commit }: StoreActionContext) => {
      const res = await get(`/users/me`);
      commit('setMe', res.data);
    },
    putMe: async (_: StoreActionContext, me: User) => {
      await put(`/users/me`, me);
    },
  } as CommonStoreActions,
} as CommonStoreModule;
