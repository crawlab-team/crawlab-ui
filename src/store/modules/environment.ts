import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';

const state = {
  ...getDefaultStoreState<Environment>('environment'),
} as EnvironmentStoreState;

const getters = {
  ...getDefaultStoreGetters<Environment>(),
} as EnvironmentStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Environment>(),
} as EnvironmentStoreMutations;

const actions = {
  ...getDefaultStoreActions<Environment>('/environments'),
} as EnvironmentStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as EnvironmentStoreModule;
