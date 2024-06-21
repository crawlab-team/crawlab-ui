import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import {
  GIT_REF_TYPE_BRANCH,
  TAB_NAME_BRANCHES,
  TAB_NAME_CHANGES,
  TAB_NAME_FILES,
  TAB_NAME_IGNORE,
  TAB_NAME_LOGS,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TAGS,
} from '@/constants';
import useRequest from '@/services/request';
import { debounce, translate } from '@/utils';
import {
  getBaseFileStoreActions,
  getBaseFileStoreMutations,
  getBaseFileStoreState,
} from '@/store/utils/file';

const t = translate;

const endpoint = '/gits';

const { get, post } = useRequest();

const state = {
  ...getDefaultStoreState<Git>('git'),
  ...getBaseFileStoreState(),
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') },
    { id: TAB_NAME_FILES, title: t('common.tabs.files') },
    { id: TAB_NAME_BRANCHES, title: t('common.tabs.branches') },
    { id: TAB_NAME_TAGS, title: t('common.tabs.tags') },
    { id: TAB_NAME_LOGS, title: t('common.tabs.logs') },
    { id: TAB_NAME_CHANGES, title: t('common.tabs.changes') },
    { id: TAB_NAME_IGNORE, title: t('common.tabs.ignore') },
  ],
  gitData: undefined,
  gitDataLoading: false,
  gitChangeSelection: [],
  gitRemoteRefs: [],
  currentBranch: undefined,
  gitBranches: [],
  gitRemoteBranches: [],
  gitLogs: [],
  gitTags: [],
} as GitStoreState;

const getters = {
  ...getDefaultStoreGetters<Git>(),
  gitLogsMap: (state: GitStoreState) => {
    const m = new Map<string, GitLog>();
    state.gitData?.logs?.forEach(l => {
      if (l.hash) {
        m.set(l.hash, l);
      }
    });
    return m;
  },
  gitBranchSelectOptions: (state: GitStoreState) => {
    return state.gitRemoteRefs
      .filter(r => r.type === GIT_REF_TYPE_BRANCH)
      .map(r => ({
        label: r.name,
        value: r.name,
      }));
  },
} as GitStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Git>(),
  ...getBaseFileStoreMutations<GitStoreState>(),
  setGitData(state: GitStoreState, gitData: GitData) {
    state.gitData = gitData;
  },
  resetGitData: (state: GitStoreState) => {
    state.gitData = {};
  },
  setGitDataLoading: (state: GitStoreState, loading: boolean) => {
    state.gitDataLoading = loading;
  },
  setGitChangeSelection: (state: GitStoreState, selection: GitChange[]) => {
    state.gitChangeSelection = selection;
  },
  resetGitChangeSelection: (state: GitStoreState) => {
    state.gitChangeSelection = [];
  },
  setGitRemoteRefs: (state: GitStoreState, refs: GitRef[]) => {
    state.gitRemoteRefs = refs;
  },
  resetGitRemoteRefs: (state: GitStoreState) => {
    state.gitRemoteRefs = [];
  },
  setCurrentBranch: (state: GitStoreState, branch: GitRef) => {
    state.currentBranch = branch;
  },
  resetCurrentBranch: (state: GitStoreState) => {
    state.currentBranch = undefined;
  },
  setGitBranches: (state: GitStoreState, refs: GitRef[]) => {
    state.gitBranches = refs;
  },
  resetGitBranches: (state: GitStoreState) => {
    state.gitBranches = [];
  },
  setGitRemoteBranches: (state: GitStoreState, refs: GitRef[]) => {
    state.gitRemoteBranches = refs;
  },
  resetGitRemoteBranches: (state: GitStoreState) => {
    state.gitRemoteBranches = [];
  },
  setGitLogs: (state: GitStoreState, logs: GitLog[]) => {
    state.gitLogs = logs;
  },
  resetGitLogs: (state: GitStoreState) => {
    state.gitLogs = [];
  },
  setGitTags: (state: GitStoreState, refs: GitRef[]) => {
    state.gitTags = refs;
  },
  resetGitTags: (state: GitStoreState) => {
    state.gitTags = [];
  },
} as GitStoreMutations;

const actions = {
  ...getDefaultStoreActions<Git>('/gits'),
  ...getBaseFileStoreActions<GitStoreState>(endpoint),
  getGit: debounce(
    async (
      { commit }: StoreActionContext<GitStoreState>,
      { id }: { id: string }
    ) => {
      commit('setGitDataLoading', true);
      try {
        const res = await get(`${endpoint}/${id}/git`);
        commit('setGitData', res?.data || {});
        return res;
      } finally {
        commit('setGitDataLoading', false);
      }
    }
  ),
  cloneGit: async (
    _: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    return await post(`${endpoint}/${id}/clone`);
  },
  getGitRemoteRefs: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/git/remote-refs`);
    commit('setGitRemoteRefs', res?.data || []);
    return res;
  },
  getCurrentBranch: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/branches/current`);
    commit('setCurrentBranch', res?.data);
    return res;
  },
  getBranches: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/branches`);
    commit('setGitBranches', res?.data || []);
    return res;
  },
  getRemoteBranches: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/branches/remote`);
    commit('setGitRemoteBranches', res?.data || []);
    return res;
  },
  checkoutBranch: async (
    _: StoreActionContext<GitStoreState>,
    { id, branch }: { id: string; branch: string }
  ) => {
    return await post(`${endpoint}/${id}/branches/checkout`, {
      branch,
    });
  },
  checkoutRemoteBranch: async (
    _: StoreActionContext<GitStoreState>,
    { id, branch }: { id: string; branch: string }
  ) => {
    return await post(`${endpoint}/${id}/branches/remote/checkout`, {
      branch,
    });
  },
  getLogs: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/logs`);
    commit('setGitLogs', res?.data || []);
    return res;
  },
  getGitTags: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/git/tags`);
    commit('setGitTags', res?.data || []);
    return res;
  },
  gitCheckoutTag: async (
    _: StoreActionContext<GitStoreState>,
    { id, tag }: { id: string; tag: string }
  ) => {
    return await post(`${endpoint}/${id}/tags/checkout`, { tag });
  },
  gitPull: async (
    { state }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await post(`${endpoint}/${id}/git/pull`, {});
    return res;
  },
  gitCommit: async (
    { state }: StoreActionContext<GitStoreState>,
    { id, commit_message }: { id: string; commit_message: string }
  ) => {
    const paths = state.gitChangeSelection.map(d => d.path);
    console.debug(paths);
    const res = await post(`${endpoint}/${id}/git/commit`, {
      paths,
      commit_message,
    });
    return res;
  },
} as GitStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as GitStoreModule;
