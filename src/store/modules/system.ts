import useRequest from '@/services/request';
import { getMd5 } from '@/utils';

const { get, post, put } = useRequest();

const getDefaultSetting = (key: string): Setting => {
  return { key, value: {} };
};

const state = {
  settings: {},
} as SystemStoreState;

const getters = {} as SystemStoreGetters;

const mutations = {
  setSetting: (state: SystemStoreState, { key, value }) => {
    state.settings[key] = value || getDefaultSetting(key);
  },
  resetSetting: (state: SystemStoreState, { key }) => {
    state.settings[key] = getDefaultSetting(key);
  },
  setSettings: (state: SystemStoreState, { settings }) => {
    state.settings = settings;
  },
  resetSettings: (state: SystemStoreState) => {
    state.settings = {};
  },
} as SystemStoreMutations;

const actions = {
  getSetting: async (
    { commit }: StoreActionContext<SystemStoreState>,
    { key }: { key: string }
  ) => {
    const res = await get(`/settings/${key}`);
    const resData = res.data || getDefaultSetting(key);
    commit('setSetting', { key, value: resData });
  },
  saveSetting: async (
    _: StoreActionContext<SystemStoreState>,
    {
      key,
      value,
    }: {
      key: string;
      value: Setting;
    }
  ) => {
    if (!value._id) {
      await post(`/settings/${key}`, value);
    } else {
      await put(`/settings/${key}`, value);
    }
  },
} as SystemStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as SystemStoreModule;
