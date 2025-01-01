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
  installedDependenciesTableLoading: false,
  installedDependenciesTableData: [],
  installedDependenciesTablePagination: getDefaultPagination(),
  installedDependenciesTableTotal: 0,
  searchRepoTableLoading: false,
  searchRepoTableData: [],
  searchRepoTablePagination: getDefaultPagination(),
  searchRepoTableTotal: 0,
  configSetupTableLoading: false,
  configSetupTableData: [],
  configSetupTablePagination: getDefaultPagination(),
  configSetupTableTotal: 0,
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
  activeTargetName: undefined,
  activeTargetStatus: undefined,
  activeTargetLogs: [],
  config: undefined,
  configVersions: [],
  activeConfigSetup: undefined,
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
  setInstalledDependenciesTableLoading: (
    state: DependencyStoreState,
    loading: boolean
  ): void => {
    state.installedDependenciesTableLoading = loading;
  },
  setInstalledDependenciesTableData: (
    state: DependencyStoreState,
    data: TableDataWithTotal<DependencyRepo>
  ): void => {
    state.installedDependenciesTableData = data.data;
    state.installedDependenciesTableTotal = data.total;
  },
  resetInstalledDependenciesTableData: (state: DependencyStoreState): void => {
    state.installedDependenciesTableData = [];
    state.installedDependenciesTableTotal = 0;
  },
  setInstalledDependenciesTablePagination: (
    state: DependencyStoreState,
    pagination: TablePagination
  ): void => {
    state.installedDependenciesTablePagination = pagination;
  },
  resetInstalledDependenciesTablePagination: (
    state: DependencyStoreState
  ): void => {
    state.installedDependenciesTablePagination = getDefaultPagination();
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
  setConfigSetupTableLoading: (
    state: DependencyStoreState,
    loading: boolean
  ): void => {
    state.configSetupTableLoading = loading;
  },
  setConfigSetupTableData: (
    state: DependencyStoreState,
    data: TableDataWithTotal<DependencyConfigSetup>
  ): void => {
    state.configSetupTableData = data.data;
    state.configSetupTableTotal = data.total;
  },
  resetConfigSetupTableData: (state: DependencyStoreState): void => {
    state.configSetupTableData = [];
    state.configSetupTableTotal = 0;
  },
  setConfigSetupTablePagination: (
    state: DependencyStoreState,
    pagination: TablePagination
  ): void => {
    state.configSetupTablePagination = pagination;
  },
  resetConfigSetupTablePagination: (state: DependencyStoreState): void => {
    state.configSetupTablePagination = getDefaultPagination();
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
  setSetupForm: (
    state: DependencyStoreState,
    form: DependencySetupForm
  ): void => {
    state.setupForm = form;
  },
  resetSetupForm: (state: DependencyStoreState): void => {
    state.setupForm = {};
  },
  setSetupLoading: (state: DependencyStoreState, loading: boolean): void => {
    state.setupLoading = loading;
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
  setActiveTargetName: (state: DependencyStoreState, name: string): void => {
    state.activeTargetName = name;
  },
  resetActiveTargetName: (state: DependencyStoreState): void => {
    state.activeTargetName = undefined;
  },
  setActiveTargetStatus: (
    state: DependencyStoreState,
    status: DependencyStatus
  ): void => {
    state.activeTargetStatus = status;
  },
  resetActiveTargetStatus: (state: DependencyStoreState): void => {
    state.activeTargetStatus = undefined;
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
  setConfigVersions: (
    state: DependencyStoreState,
    versions: string[]
  ): void => {
    state.configVersions = versions;
  },
  resetConfigVersions: (state: DependencyStoreState): void => {
    state.configVersions = [];
  },
  setGetConfigVersionsLoading: (
    state: DependencyStoreState,
    loading: boolean
  ): void => {
    state.getConfigVersionsLoading = loading;
  },
  setActiveConfigSetup: (
    state: DependencyStoreState,
    setup: DependencyConfigSetup
  ): void => {
    state.activeConfigSetup = setup;
  },
  resetActiveConfigSetup: (state: DependencyStoreState): void => {
    state.activeConfigSetup = undefined;
  },
} as DependencyStoreMutations;

const actions = {
  ...getDefaultStoreActions<Dependency>('/dependencies/repos'),
  getInstalledDependencyList: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, tablePagination, tableListFilter, tableListSort } = state;
    const { page, size } = tablePagination;
    try {
      commit('setInstalledDependenciesTableLoading', true);
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
        getMd5(tableData.data) !== getMd5(state.installedDependenciesTableData)
      ) {
        commit('setInstalledDependenciesTableData', tableData);
      }
      return res;
    } catch (e) {
      throw e;
    } finally {
      commit('setInstalledDependenciesTableLoading', false);
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
      if (getMd5(state.searchRepoTableData) !== getMd5(tableData.data)) {
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
  getDependencyConfigVersions: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang } = state;
    commit('setGetConfigVersionsLoading', true);
    try {
      const res = await getList(`${endpoint}/configs/${lang}/versions`);
      commit('setConfigVersions', res.data || []);
      return res;
    } finally {
      commit('setGetConfigVersionsLoading', false);
    }
  },
  getConfigSetupList: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, configSetupTablePagination } = state;
    const { page, size } = configSetupTablePagination;
    try {
      commit('setConfigSetupTableLoading', true);
      const res = await getList(`${endpoint}/configs/${lang}/setups`, {
        page,
        size,
      });
      const tableData = {
        data: res.data || [],
        total: res.total,
      };
      if (getMd5(state.configSetupTableData) !== getMd5(tableData.data)) {
        commit('setConfigSetupTableData', tableData);
      }
      return res;
    } catch (e) {
      throw e;
    } finally {
      commit('setConfigSetupTableLoading', false);
    }
  },
  installConfigSetup: async ({
    state,
    commit,
  }: StoreActionContext<DependencyStoreState>) => {
    const { lang, setupForm } = state;
    const { node_id, version, mode, node_ids } = setupForm;
    let payload: Record<string, any> = {
      mode,
      version,
    };
    if (node_id) {
      payload.node_ids = [node_id];
    } else {
      payload.node_ids = node_ids;
    }
    commit('setSetupLoading', true);
    try {
      await post(`${endpoint}/configs/${lang}/setups/install`, payload);
      ElMessage.success(t('common.message.success.startInstall'));
    } catch (e: any) {
      ElMessage.error(e.message);
      throw e;
    } finally {
      commit('setSetupLoading', false);
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
