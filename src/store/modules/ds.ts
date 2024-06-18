import { DATA_SOURCE_CONNECT_TYPE_STANDARD } from '@/constants/ds';
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
  ...getDefaultStoreState<DataSource>('ds' as StoreNamespace),
  newFormFn: () => {
    return {
      connect_type: DATA_SOURCE_CONNECT_TYPE_STANDARD,
      hosts: [],
    };
  },
  tabs: [{ id: TAB_NAME_OVERVIEW, title: 'common.tabs.overview' }],
} as DataSourceStoreState;

const getters = {
  ...getDefaultStoreGetters<DataSource>(),
} as DataSourceStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<DataSource>(),
} as DataSourceStoreMutations;

const actions = {
  ...getDefaultStoreActions<DataSource>('/data-sources'),
  changePassword: async (
    ctx: StoreActionContext,
    { id, password }: { id: string; password: string }
  ) => {
    return await post(`/data-sources/${id}/change-password`, { password });
  },
} as DataSourceStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as DataSourceStoreModule;
