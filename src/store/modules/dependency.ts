import {
  getDefaultPagination,
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
  translate,
} from '@/utils';
import useRequest from '@/services/request';
import { ElMessage } from 'element-plus';

const t = translate;

const { getList, post } = useRequest();

const endpoint = '/dependencies';

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
  uninstallForm: {
    mode: 'all',
  },
  uninstallLoading: false,
  getVersionsLoading: false,
  versions: [],
  activeDependency: undefined,
  activeDependencyLogs: [],
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
    state.uninstallForm = {
      mode: 'all',
    };
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
  setActiveDependency: (
    state: DependencyStoreState,
    activeDependency: DependencyRepo
  ): void => {
    state.activeDependency = activeDependency;
  },
  resetActiveDependency: (state: DependencyStoreState): void => {
    state.activeDependency = undefined;
  },
  setActiveDependencyLogs: (
    state: DependencyStoreState,
    activeDependencyLogs: DependencyLog[]
  ): void => {
    state.activeDependencyLogs = activeDependencyLogs;
  },
  resetActiveDependencyLogs: (state: DependencyStoreState): void => {
    state.activeDependencyLogs = [];
  },
} as DependencyStoreMutations;

const actions = {
  ...getDefaultStoreActions<Dependency>('/dependencies/repos'),
  getList: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, tablePagination, tableListFilter, tableListSort } = state;
    const { page, size } = tablePagination;
    try {
      commit('setTableLoading', true);
      const res = await getList(`${endpoint}/repos`, {
        page,
        size,
        conditions: JSON.stringify(tableListFilter),
        sort: JSON.stringify(tableListSort),
        lang,
      });
      commit('setTableData', {
        data: res.data || [],
        total: res.total,
      });
      return res;
    } catch (e) {
      throw e;
    } finally {
      commit('setTableLoading', false);
    }
  },
  searchRepoList: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, searchQuery, searchRepoTablePagination } = state;
    const { page, size } = searchRepoTablePagination;
    try {
      commit('setSearchRepoTableLoading', true);
      const res = await getList(`${endpoint}/repos/search`, {
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
      const res = await getList(`${endpoint}/repos/versions`, {
        lang,
        repo: installForm?.name,
      });
      commit('setVersions', res.data || []);
      return res;
    } finally {
      commit('setGetVersionsLoading', false);
    }
  },
  installDependency: async ({
    state,
    commit,
    dispatch,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, installForm } = state;
    commit('setInstallLoading', true);
    try {
      await post(`${endpoint}/repos/install`, {
        ...installForm,
        lang,
      });
      ElMessage.success(t('common.message.success.startInstall'));
      await dispatch('getList');
    } catch (e: any) {
      ElMessage.error(e.message);
      throw e;
    } finally {
      commit('setInstallLoading', false);
    }
  },
  uninstallDependency: async ({
    state,
    commit,
    dispatch,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, uninstallForm } = state;
    commit('setUninstallLoading', true);
    try {
      await post(`${endpoint}/repos/uninstall`, {
        ...uninstallForm,
        lang,
      });
      ElMessage.success(t('common.message.success.startUninstall'));
      await dispatch('getList');
    } catch (e: any) {
      ElMessage.error(e.message);
      throw e;
    } finally {
      commit('setUninstallLoading', false);
    }
  },
  getActiveDependencyLogs: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, activeDependency } = state;
    if (!activeDependency) return;
    try {
      const res = await getList(`${endpoint}/${activeDependency._id}/logs`, {
        lang,
        repo: activeDependency?.name,
      });
      commit('setActiveDependencyLogs', res.data || []);
      return res;
    } catch (e) {
      throw e;
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
