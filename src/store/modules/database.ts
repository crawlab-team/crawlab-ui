import { DATABASE_CONNECT_TYPE_STANDARD } from '@/constants/database';
import useRequest from '@/services/request';
import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils';
import { TAB_NAME_OVERVIEW } from '@/constants';

const { post } = useRequest();

const state = {
  ...getDefaultStoreState<Database>('database' as StoreNamespace),
  newFormFn: () => {
    return {
      connect_type: DATABASE_CONNECT_TYPE_STANDARD,
      hosts: [],
    };
  },
  tabs: [{ id: TAB_NAME_OVERVIEW, title: 'common.tabs.overview' }],
} as DatabaseStoreState;

const getters = {
  ...getDefaultStoreGetters<Database>(),
} as DatabaseStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Database>(),
} as DatabaseStoreMutations;

const actions = {
  ...getDefaultStoreActions<Database>('/databases'),
  changePassword: async (
    ctx: StoreActionContext,
    { id, password }: { id: string; password: string }
  ) => {
    return await post(`/databases/${id}/change-password`, { password });
  },
} as DatabaseStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as DatabaseStoreModule;
