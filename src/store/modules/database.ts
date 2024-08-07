import useRequest from '@/services/request';
import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils';
import {
  TAB_NAME_CONSOLE,
  TAB_NAME_DATABASES,
  TAB_NAME_OVERVIEW,
} from '@/constants';

const { get, getList, post } = useRequest();

const state = {
  ...getDefaultStoreState<Database>('database' as StoreNamespace),
  newFormFn: () => {
    return {
      hosts: [],
    };
  },
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: 'common.tabs.overview' },
    { id: TAB_NAME_DATABASES, title: 'common.tabs.databases' },
    { id: TAB_NAME_CONSOLE, title: 'common.tabs.console' },
  ],
  metadata: undefined,
  tablePreviewData: [],
  tablePreviewPagination: {
    page: 1,
    size: 10,
  },
  tablePreviewTotal: 0,
} as DatabaseStoreState;

const getters = {
  ...getDefaultStoreGetters<Database>(),
} as DatabaseStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Database>(),
  setMetadata(state: DatabaseStoreState, metadata: DatabaseMetadata) {
    state.metadata = metadata;
  },
  setTablePreviewData(
    state: DatabaseStoreState,
    tablePreviewData: Record<string, any>[]
  ) {
    state.tablePreviewData = tablePreviewData;
  },
  setTablePreviewTotal(state: DatabaseStoreState, total: number) {
    state.tablePreviewTotal = total;
  },
  setTablePreviewPagination(
    state: DatabaseStoreState,
    pagination: TablePagination
  ) {
    state.tablePreviewPagination = pagination;
  },
} as DatabaseStoreMutations;

const actions = {
  ...getDefaultStoreActions<Database>('/databases'),
  changePassword: async (
    ctx: StoreActionContext,
    { id, password }: { id: string; password: string }
  ) => {
    return await post(`/databases/${id}/change-password`, { password });
  },
  getMetadata: async (ctx: StoreActionContext, { id }: { id: string }) => {
    const res = await get(`/databases/${id}/metadata`);
    ctx.commit('setMetadata', res.data);
    return res;
  },
  getTablePreview: async (
    ctx: StoreActionContext<DatabaseStoreState>,
    { id, database, table }: { id: string; database: string; table: string }
  ) => {
    const res = await getList<Record<string, any>>(
      `/databases/${id}/table-preview`,
      {
        page: ctx.state.tablePreviewPagination?.page,
        size: ctx.state.tablePreviewPagination?.size,
        database,
        table,
      }
    );
    ctx.commit('setTablePreviewData', res.data);
    ctx.commit('setTablePreviewTotal', res.total);
    return res;
  },
} as DatabaseStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as DatabaseStoreModule;
