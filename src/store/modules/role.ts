import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import { TAB_NAME_OVERVIEW, TAB_NAME_PAGES, TAB_NAME_USERS } from '@/constants';
import { ref } from 'vue';
import { ClCheckboxTree } from '@/components';

const state = {
  ...getDefaultStoreState<Role>('role'),
  tabs: [
    {
      id: TAB_NAME_OVERVIEW,
      title: 'layouts.routes.roles.detail.tabs.overview',
    },
    {
      id: TAB_NAME_PAGES,
      title: 'layouts.routes.roles.detail.tabs.pages',
    },
    {
      id: TAB_NAME_USERS,
      title: 'layouts.routes.roles.detail.tabs.users',
    },
  ],
  pagesCheckAllStatus: 'unchecked',
} as RoleStoreState;

const getters = {
  ...getDefaultStoreGetters<Role>(),
} as RoleStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Role>(),
  setPagesCheckAllStatus: (state: RoleStoreState, status) => {
    state.pagesCheckAllStatus = status;
  },
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
