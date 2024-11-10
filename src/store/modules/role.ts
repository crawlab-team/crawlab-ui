import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';

const state = {
  ...getDefaultStoreState<Role>('role'),
  newFormFn: () => {
    return {};
  },
} as RoleStoreState;

const getters = {
  ...getDefaultStoreGetters<Role>(),
} as RoleStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Role>(),
} as RoleStoreMutations;

const actions = {
  ...getDefaultStoreActions<Role>('/roles'),
} as RoleStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as RoleStoreModule;
