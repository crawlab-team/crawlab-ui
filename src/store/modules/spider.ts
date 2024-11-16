import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import useRequest from '@/services/request';
import {
  TAB_NAME_DATA,
  TAB_NAME_DEPENDENCIES,
  TAB_NAME_FILES,
  TAB_NAME_OVERVIEW,
  TAB_NAME_SCHEDULES,
  TAB_NAME_TASKS,
} from '@/constants/tab';
import { TASK_MODE_RANDOM } from '@/constants/task';
import { translate } from '@/utils/i18n';
import {
  getBaseFileStoreActions,
  getBaseFileStoreGetters,
  getBaseFileStoreMutations,
  getBaseFileStoreState,
} from '@/store/utils/file';
import { ElMessage } from 'element-plus';

// i18n
const t = translate;

const endpoint = '/spiders';

const { get, post, getList } = useRequest();

const state = {
  ...getDefaultStoreState<Spider>('spider'),
  ...getBaseFileStoreState(),
  newFormFn: () => {
    return {
      mode: TASK_MODE_RANDOM,
      priority: 5,
    };
  },
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') },
    { id: TAB_NAME_FILES, title: t('common.tabs.files') },
    { id: TAB_NAME_TASKS, title: t('common.tabs.tasks') },
    { id: TAB_NAME_SCHEDULES, title: t('common.tabs.schedules') },
    { id: TAB_NAME_DATA, title: t('common.tabs.data') },
    { id: TAB_NAME_DEPENDENCIES, title: t('common.tabs.dependencies') },
  ],
  dataDisplayAllFields: false,
  databaseMetadata: undefined,
} as SpiderStoreState;

const getters = {
  ...getDefaultStoreGetters<Spider>(),
  ...getBaseFileStoreGetters(),
  databaseTableSelectOptions: (state: SpiderStoreState) => {
    const { databaseMetadata } = state;
    if (!databaseMetadata) return [];
    const { databases } = databaseMetadata;
    if (!databases?.length) return [];
    if (databases.length === 1) {
      return (
        databases[0].tables?.map(table => ({
          label: table.name,
          value: table.name,
        })) || []
      );
    } else {
      const options: SelectOption[] = [];
      databases.forEach(database => {
        const { tables } = database;
        if (!tables?.length) return;
        options.push({
          label: database.name,
          value: database.name,
          children: tables.map(table => ({
            label: table.name,
            value: table.name,
          })),
        });
      });
      return options;
    }
  },
} as SpiderStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Spider>(),
  ...getBaseFileStoreMutations<SpiderStoreState>(),
  setDataDisplayAllFields: (state: SpiderStoreState, display: boolean) => {
    state.dataDisplayAllFields = display;
  },
  setDatabaseMetadata: (state: SpiderStoreState, metadata: any) => {
    state.databaseMetadata = metadata;
  },
} as SpiderStoreMutations;

const actions = {
  ...getDefaultStoreActions<Spider>(endpoint),
  ...getBaseFileStoreActions<SpiderStoreState>(endpoint),
  getList: async ({ state, commit }: StoreActionContext<SpiderStoreState>) => {
    const payload = {
      ...state.tablePagination,
      conditions: JSON.stringify(state.tableListFilter),
      sort: JSON.stringify(state.tableListSort),
      stats: true,
    };
    const res = await getList(`/spiders`, payload);
    commit('setTableData', { data: res.data || [], total: res.total });
    return res;
  },
  runById: async (
    { commit }: StoreActionContext<BaseStoreState<Spider>>,
    { id, options }: { id: string; options: SpiderRunOptions }
  ) => {
    const res = await post(`/spiders/${id}/run`, options);
    return res;
  },
  getDatabaseMetadata: async (
    { commit }: StoreActionContext<SpiderStoreState>,
    id: string
  ) => {
    try {
      const res = await get(`/databases/${id}/metadata`);
      commit('setDatabaseMetadata', res.data);
      return res.data;
    } catch (e: any) {
      ElMessage.error(e.message);
      commit('setDatabaseMetadata', undefined);
    }
  },
} as SpiderStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as SpiderStoreModule;
