import {
  getDefaultPagination,
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils';
import useRequest from '@/services/request';

const { getList } = useRequest();

const endpoint = '/dependencies/repos';

const state = {
  ...getDefaultStoreState<DependencyRepo>('dependency' as StoreNamespace),
  lang: 'python',
  searchQuery: '',
  repoTabName: 'installed',
  tableListFilter: [{ key: 'type', op: 'eq', value: 'python' }],
  searchRepoTableLoading: false,
  searchRepoTableData: [],
  searchRepoTablePagination: getDefaultPagination(),
  searchRepoTableTotal: 0,
  installForm: {
    mode: 'all',
  },
  installLoading: false,
  uninstallForm: {},
  uninstallLoading: false,
  getVersionsLoading: false,
  versions: [],
} as DependencyStoreState;

const getters = {
  ...getDefaultStoreGetters<DependencyRepo>(),
} as DependencyStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<DependencyRepo>(),
  setLang: (state: DependencyStoreState, lang: DependencyLang): void => {
    state.lang = lang;
  },
  setSearchQuery: (state: DependencyStoreState, query: string): void => {
    state.searchQuery = query;
  },
  setRepoTabName: (
    state: DependencyStoreState,
    name: DependencyRepoTabName
  ): void => {
    state.repoTabName = name;
  },
  setSearchRepoTableLoading: (
    state: DependencyStoreState,
    loading: boolean
  ): void => {
    state.searchRepoTableLoading = loading;
  },
  setSearchRepoTableData: (
    state: DependencyStoreState,
    data: TableDataWithTotal<DependencyRepo>
  ): void => {
    state.searchRepoTableData = data.data;
    state.searchRepoTableTotal = data.total;
  },
  resetSearchRepoTableData: (state: DependencyStoreState): void => {
    state.searchRepoTableData = [];
    state.searchRepoTableTotal = 0;
  },
  setSearchRepoTablePagination: (
    state: DependencyStoreState,
    pagination: TablePagination
  ): void => {
    state.searchRepoTablePagination = pagination;
  },
  resetSearchRepoTablePagination: (state: DependencyStoreState): void => {
    state.searchRepoTablePagination = getDefaultPagination();
  },
  setInstallForm: (
    state: DependencyStoreState,
    form: DependencyInstallForm
  ): void => {
    state.installForm = form;
  },
  resetInstallForm: (state: DependencyStoreState): void => {
    state.installForm = {
      mode: 'all',
    };
  },
  setInstallLoading: (state: DependencyStoreState, loading: boolean): void => {
    state.installLoading = loading;
  },
  setUninstallForm: (
    state: DependencyStoreState,
    form: DependencyUninstallForm
  ): void => {
    state.uninstallForm = form;
  },
  resetUninstallForm: (state: DependencyStoreState): void => {
    state.uninstallForm = {};
  },
  setUninstallLoading: (
    state: DependencyStoreState,
    loading: boolean
  ): void => {
    state.uninstallLoading = loading;
  },
  setVersions: (state: DependencyStoreState, versions: string[]): void => {
    state.versions = versions;
  },
  resetVersions: (state: DependencyStoreState): void => {
    state.versions = [];
  },
  setGetVersionsLoading: (
    state: DependencyStoreState,
    loading: boolean
  ): void => {
    state.getVersionsLoading = loading;
  },
} as DependencyStoreMutations;

const actions = {
  ...getDefaultStoreActions<Dependency>('/dependencies/repos'),
  searchRepoList: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, searchQuery, searchRepoTablePagination } = state;
    const { page, size } = searchRepoTablePagination;
    try {
      commit('setSearchRepoTableLoading', true);
      const res = await getList(`${endpoint}/search`, {
        page,
        size,
        lang,
        query: searchQuery,
      });
      commit('setSearchRepoTableData', {
        data: res.data || [],
        total: res.total,
      });
      return res;
    } catch (e) {
      throw e;
    } finally {
      commit('setSearchRepoTableLoading', false);
    }
  },
  getRepoVersions: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, installForm } = state;
    commit('setGetVersionsLoading', true);
    try {
      const res = await getList(`${endpoint}/versions`, {
        lang,
        repo: installForm?.names?.[0],
      });
      commit('setVersions', res.data || []);
      return res;
    } finally {
      commit('setGetVersionsLoading', false);
    }
  },
} as DependencyStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as DependencyStoreModule;
