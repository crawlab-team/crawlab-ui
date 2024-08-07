import { plainClone } from '@/utils/object';
import useRequest from '@/services/request';

const { get } = useRequest();

export default {
  namespaced: true,
  state: {
    lang: localStorage.getItem('lang') || 'en',
    systemInfo: JSON.parse(localStorage.getItem('systemInfo') || '{}'),
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
  } as CommonStoreMutations,
  actions: {
    getSystemInfo: async ({ commit }: StoreActionContext) => {
      const res = await get('/system-info');
      commit('setSystemInfo', res.data);
    },
  } as CommonStoreActions,
} as CommonStoreModule;
