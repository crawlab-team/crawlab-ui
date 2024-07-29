import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import {
  TAB_NAME_MONITORING,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TASKS,
} from '@/constants/tab';
import useRequest from '@/services/request';

const { get } = useRequest();

const state = {
  ...getDefaultStoreState<CNode>('node'),
  newFormFn: () => {
    return {
      tags: [],
      max_runners: 8,
      enabled: true,
    };
  },
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: 'common.tabs.overview' },
    { id: TAB_NAME_TASKS, title: 'common.tabs.tasks' },
    { id: TAB_NAME_MONITORING, title: 'common.tabs.monitoring' },
  ],
  nodeMetricsMap: {},
} as NodeStoreState;

const getters = {
  ...getDefaultStoreGetters<CNode>(),
} as NodeStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<CNode>(),
  setNodeMetricsMap(state: NodeStoreState, metricsMap: Record<string, Metric>) {
    state.nodeMetricsMap = metricsMap;
  },
} as NodeStoreMutations;

const actions = {
  ...getDefaultStoreActions<CNode>('/nodes'),
  async getNodeMetrics({ state, commit }: StoreActionContext<NodeStoreState>) {
    const { page, size } = state.tablePagination;
    const res = await get<Record<string, Metric>>('nodes/metrics', {
      page,
      size,
      conditions: JSON.stringify(state.tableListFilter),
      sort: JSON.stringify(state.tableListSort),
    } as ListRequestParams);
    commit('setNodeMetricsMap', res.data);
    return res;
  },
} as NodeStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NodeStoreModule;
