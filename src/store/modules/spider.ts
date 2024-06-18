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
  getBaseFileStoreMutations,
  getBaseFileStoreState,
} from '@/store/utils/file';

// i18n
const t = translate;

const endpoint = '/spiders';

const { post, getList } = useRequest();

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
    // {id: TAB_NAME_SETTINGS, title: t('common.tabs.settings')},
  ],
  dataDisplayAllFields: false,
} as SpiderStoreState;

const getters = {
  ...getDefaultStoreGetters<Spider>(),
} as SpiderStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Spider>(),
  ...getBaseFileStoreMutations<SpiderStoreState>(),
  setDataDisplayAllFields: (state: SpiderStoreState, display: boolean) => {
    state.dataDisplayAllFields = display;
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
} as SpiderStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as SpiderStoreModule;
