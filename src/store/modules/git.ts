import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import {
  GIT_REF_TYPE_BRANCH,
  TAB_NAME_OVERVIEW,
  TAB_NAME_FILES,
  TAB_NAME_CHANGES,
  TAB_NAME_LOGS,
  TAB_NAME_SPIDERS,
} from '@/constants';
import useRequest from '@/services/request';
import { debounce } from '@/utils';
import {
  getBaseFileStoreActions,
  getBaseFileStoreMutations,
  getBaseFileStoreState,
} from '@/store/utils/file';

const endpoint = '/gits';

const { get, post, del } = useRequest();

const state = {
  ...getDefaultStoreState<Git>('git'),
  ...getBaseFileStoreState(),
  tabs: [
    {
      id: TAB_NAME_OVERVIEW,
      title: 'common.tabs.overview',
    },
    {
      id: TAB_NAME_FILES,
      title: 'common.tabs.files',
    },
    {
      id: TAB_NAME_CHANGES,
      title: 'common.tabs.changes',
      icon: ['fa', 'code-commit'],
    },
    {
      id: TAB_NAME_LOGS,
      title: 'common.tabs.logs',
      icon: ['fa', 'code-branch'],
    },
    {
      id: TAB_NAME_SPIDERS,
      title: 'common.tabs.spiders',
    },
  ],
  gitData: undefined,
  gitDataLoading: false,
  gitChangeSelection: [],
  gitRemoteRefs: [],
  currentBranch: undefined,
  gitBranches: [],
  gitRemoteBranches: [],
  gitChanges: [],
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
  setGitChanges: (state: GitStoreState, changes: GitChange[]) => {
    state.gitChanges = changes;
  },
  resetGitChanges: (state: GitStoreState) => {
    state.gitChanges = [];
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
  newBranch: async (
    _: StoreActionContext<GitStoreState>,
    {
      id,
      sourceBranch,
      targetBranch,
    }: { id: string; sourceBranch: string; targetBranch: string }
  ) => {
    return await post(`${endpoint}/${id}/branches/new`, {
      source_branch: sourceBranch,
      target_branch: targetBranch,
    });
  },
  deleteBranch: async (
    _: StoreActionContext<GitStoreState>,
    { id, branch }: { id: string; branch: string }
  ) => {
    return await del(`${endpoint}/${id}/branches`, {
      branch,
    });
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
  getChanges: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/changes`);
    commit('setGitChanges', res?.data || []);
    return res;
  },
  addChanges: async (
    _: StoreActionContext<GitStoreState>,
    { id, changes }: { id: string; changes: GitChange[] }
  ) => {
    return await post(`${endpoint}/${id}/changes`, {
      changes,
    });
  },
  deleteChanges: async (
    _: StoreActionContext<GitStoreState>,
    { id, changes }: { id: string; changes: GitChange[] }
  ) => {
    return await del(`${endpoint}/${id}/changes`, {
      changes,
    });
  },
  commit: async (
    _: StoreActionContext<GitStoreState>,
    {
      id,
      message,
      changes,
    }: { id: string; message: string; changes: GitChange[] }
  ) => {
    return await post(`${endpoint}/${id}/commit`, {
      message,
      changes,
    });
  },
  pull: async (
    _: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    return await post(`${endpoint}/${id}/pull`, {});
  },
  push: async (
    _: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    return await post(`${endpoint}/${id}/push`, {});
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
    _: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    return await post(`${endpoint}/${id}/git/pull`, {});
  },
  gitCommit: async (
    { state }: StoreActionContext<GitStoreState>,
    { id, commit_message }: { id: string; commit_message: string }
  ) => {
    const paths = state.gitChangeSelection.map(d => d.path);
    return await post(`${endpoint}/${id}/git/commit`, {
      paths,
      commit_message,
    });
  },
  createSpider: async (
    _: StoreActionContext<GitStoreState>,
    { id, spider }: { id: string; spider: Spider }
  ) => {
    return await post(`${endpoint}/${id}/spiders`, spider);
  },
} as GitStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as GitStoreModule;
