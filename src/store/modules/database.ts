import useRequest from '@/services/request';
import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
  translate,
} from '@/utils';
import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_DATABASES,
  TAB_NAME_CONSOLE,
  TAB_NAME_MONITORING,
  TAB_NAME_DATA,
  TAB_NAME_RESULTS,
  TAB_NAME_OUTPUT,
} from '@/constants';
import { ElMessage } from 'element-plus';

const t = translate;

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
    { id: TAB_NAME_MONITORING, title: 'common.tabs.monitoring' },
  ],
  metadata: undefined,
  tablePreviewData: [],
  tablePreviewPagination: {
    page: 1,
    size: 10,
  },
  tablePreviewTotal: 0,
  activeTable: undefined,
  activeDatabaseName: '',
  activeNavItem: undefined,
  defaultTabName: TAB_NAME_DATA,
  consoleContent: '',
  consoleSelectedContent: undefined,
  consoleQueryLoading: false,
  consoleQueryResults: undefined,
  consoleQueryResultsActiveTabName: undefined,
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
  setActiveTable(state: DatabaseStoreState, table: DatabaseTable) {
    state.activeTable = table;
  },
  resetActiveTable(state: DatabaseStoreState) {
    state.activeTable = undefined;
  },
  setActiveDatabaseName(state: DatabaseStoreState, name: string) {
    state.activeDatabaseName = name;
  },
  setActiveNavItem(state: DatabaseStoreState, navItem: DatabaseNavItem) {
    state.activeNavItem = navItem;
  },
  setDefaultTabName(state: DatabaseStoreState, tabName: string) {
    state.defaultTabName = tabName;
  },
  setConsoleContent(state: DatabaseStoreState, content: string) {
    state.consoleContent = content;
  },
  setConsoleSelectedContent(state: DatabaseStoreState, content?: string) {
    state.consoleSelectedContent = content;
  },
  setConsoleQueryLoading(state: DatabaseStoreState, loading: boolean) {
    state.consoleQueryLoading = loading;
  },
  setConsoleQueryResults(
    state: DatabaseStoreState,
    results?: DatabaseQueryResults
  ) {
    state.consoleQueryResults = results;
  },
  setConsoleQueryResultsActiveTabName(
    state: DatabaseStoreState,
    tabName?: string
  ) {
    state.consoleQueryResultsActiveTabName = tabName;
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
      `/databases/${id}/tables/preview`,
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
  getTable: async (
    ctx: StoreActionContext<DatabaseStoreState>,
    { id, database, table }: { id: string; database: string; table: string }
  ) => {
    const res = await get(`/databases/${id}/tables/metadata`, {
      database,
      table,
    });
    ctx.commit('setActiveTable', res.data);
    return res;
  },
  runQuery: async (
    ctx: StoreActionContext<DatabaseStoreState>,
    { id, database, query }: { id: string; database?: string; query?: string }
  ) => {
    if (!query) {
      query = ctx.state.consoleSelectedContent;
    }
    if (!query) {
      ElMessage.warning(t('components.database.message.warning.emptyQuery'));
      return;
    }
    ctx.commit('setConsoleQueryLoading', true);
    try {
      const res = await post<any, ResponseWithData<DatabaseQueryResults>>(
        `/databases/${id}/query`,
        {
          database,
          query,
        }
      );
      ctx.commit('setConsoleQueryResults', res.data);
      if (res.data?.columns?.length) {
        ctx.commit('setConsoleQueryResultsActiveTabName', TAB_NAME_RESULTS);
      } else {
        ctx.commit('setConsoleQueryResultsActiveTabName', TAB_NAME_OUTPUT);
      }
      return res;
    } catch (e: any) {
      ElMessage.error(e.message);
    } finally {
      ctx.commit('setConsoleQueryLoading', false);
    }
  },
} as DatabaseStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as DatabaseStoreModule;
