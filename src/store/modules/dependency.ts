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
import { getMd5 } from '@/utils/hash';

const t = translate;

const { get, getList, post, put } = useRequest();

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
  setupForm: {
    mode: 'all',
  },
  setupLoading: false,
  getVersionsLoading: false,
  versions: [],
  activeTargetId: undefined,
  activeTargetLogs: [],
  config: undefined,
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
  setActiveTargetId: (state: DependencyStoreState, id: string): void => {
    state.activeTargetId = id;
  },
  resetActiveTargetId: (state: DependencyStoreState): void => {
    state.activeTargetId = undefined;
  },
  setActiveTargetLogs: (
    state: DependencyStoreState,
    logs: DependencyLog[]
  ): void => {
    state.activeTargetLogs = logs;
  },
  resetActiveTargetLogs: (state: DependencyStoreState): void => {
    state.activeTargetLogs = [];
  },
  setConfig: (state: DependencyStoreState, config: DependencyConfig): void => {
    state.config = config;
  },
  resetConfig: (state: DependencyStoreState): void => {
    state.config = undefined;
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
      const tableData = {
        data: res.data || [],
        total: res.total,
      };
      if (
        getMd5(JSON.stringify(tableData.data)) !==
        getMd5(JSON.stringify(state.tableData))
      ) {
        console.debug('setTableData', tableData.data);
        commit('setTableData', tableData);
      }
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
      const tableData = {
        data: res.data || [],
        total: res.total,
      };
      if (
        getMd5(JSON.stringify(state.searchRepoTableData)) !==
        getMd5(JSON.stringify(tableData.data))
      ) {
        commit('setSearchRepoTableData', tableData);
      }
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
  setupConfig: async ({
    state,
    commit,
    dispatch,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, setupForm } = state;
    commit('setSetupLoading', true);
    try {
      await post(`${endpoint}/configs/setup`, {
        ...setupForm,
        lang,
      });
      ElMessage.success(t('common.message.success.startUninstall'));
      await dispatch('getList');
    } catch (e: any) {
      ElMessage.error(e.message);
      throw e;
    } finally {
      commit('setSetupLoading', false);
    }
  },
  getActiveTargetLogs: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { activeTargetId } = state;
    if (!activeTargetId) return;
    try {
      const res = await getList(`${endpoint}/${activeTargetId}/logs`);
      commit('setActiveTargetLogs', res.data || []);
      return res;
    } catch (e) {
      throw e;
    }
  },
  getDependencyConfig: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang } = state;
    try {
      const res = await get(`${endpoint}/configs/${lang}`);
      commit('setConfig', res.data);
      return res;
    } catch (e) {
      throw e;
    }
  },
  saveDependencyConfig: async ({
    state,
    dispatch,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, config } = state;
    try {
      await put(`${endpoint}/configs/${lang}`, config);
      ElMessage.success(t('common.message.success.save'));
      await dispatch('getDependencyConfig');
    } catch (e: any) {
      ElMessage.error(e.message);
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
