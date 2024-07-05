import useRequest from '@/services/request';

const { get, put } = useRequest();

export default {
  namespaced: true,
  state: {
    siteTitle: {},
  },
  getters: {},
  mutations: {
    setSiteTitle(state, siteTitle) {
      state.siteTitle = { ...siteTitle };
    },
  },
  actions: {
    getSiteTitle: async ({ state }: StoreActionContext<SystemStoreState>) => {
      const res = await get('/settings/site_title');
      state.siteTitle = res.data;
    },
    saveSiteTitle: async ({ state }: StoreActionContext<SystemStoreState>) => {
      await put('/settings/site_title', state.siteTitle);
    },
  },
} as SystemStoreModule;
