import useRequest from '@/services/request';

const { get, post, put } = useRequest();

export default {
  namespaced: true,
  state: {
    customize: { key: 'customize', value: {} },
  },
  getters: {},
  mutations: {
    setCustomize(state, siteTitle) {
      state.customize = { ...siteTitle };
    },
  },
  actions: {
    getCustomize: async ({ state }: StoreActionContext<SystemStoreState>) => {
      const res = await get('/settings/customize');
      state.customize = res.data || { key: 'customize', value: {} };
    },
    saveCustomize: async ({ state }: StoreActionContext<SystemStoreState>) => {
      if (!state.customize._id) {
        await post('/settings/customize', state.customize);
      } else {
        await put('/settings/customize', state.customize);
      }
    },
  },
} as SystemStoreModule;
