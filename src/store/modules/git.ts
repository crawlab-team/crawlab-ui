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
  TAB_NAME_SPIDERS,
  TAB_NAME_COMMITS,
} from '@/constants';
import useRequest from '@/services/request';
import {
  getBaseFileStoreActions,
  getBaseFileStoreGetters,
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
      id: TAB_NAME_COMMITS,
      title: 'common.tabs.commits',
      icon: ['fa', 'code-branch'],
    },
    {
      id: TAB_NAME_SPIDERS,
      title: 'common.tabs.spiders',
    },
  ],
  gitChangeSelection: [],
  gitRemoteRefs: [],
  currentBranch: undefined,
  gitBranches: [],
  gitRemoteBranches: [],
  gitChanges: [],
  gitLogs: [],
  gitDiff: {},
  activeFilePath: undefined,
  createSpiderLoading: false,
} as GitStoreState;

const getters = {
  ...getDefaultStoreGetters<Git>(),
  ...getBaseFileStoreGetters(),
  gitBranchSelectOptions: (state: GitStoreState) => {
    return state.gitRemoteRefs
      .filter(r => r.type === GIT_REF_TYPE_BRANCH)
      .map(r => ({
        label: r.name,
        value: r.name,
      }));
  },
  // tabs: (state: GitStoreState) => {
  //   const { form, tabs, gitChanges } = state;
  //   return tabs.map(tab => {
  //     if (form.status !== GIT_STATUS_READY) {
  //       return {
  //         ...tab,
  //         disabled: tab.id !== TAB_NAME_OVERVIEW,
  //       };
  //     }
  //     if (tab.id === TAB_NAME_CHANGES) {
  //       return {
  //         ...tab,
  //         badge: gitChanges.length,
  //         badgeType: 'danger',
  //       };
  //     }
  //     return tab;
  //   });
  // },
} as GitStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<Git>(),
  ...getBaseFileStoreMutations<GitStoreState>(),
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
  setGitDiff: (state: GitStoreState, diff: GitDiff) => {
    state.gitDiff = diff;
  },
  resetGitDiff: (state: GitStoreState) => {
    state.gitDiff = {};
  },
  setActiveFilePath: (state: GitStoreState, path: string) => {
    state.activeFilePath = path;
  },
  resetActiveFilePath: (state: GitStoreState) => {
    state.activeFilePath = undefined;
  },
  setCreateSpiderLoading: (state: GitStoreState, loading: boolean) => {
    state.createSpiderLoading = loading;
  },
} as GitStoreMutations;

const actions = {
  ...getDefaultStoreActions<Git>('/gits'),
  ...getBaseFileStoreActions<GitStoreState>(endpoint),
  cloneGit: async (
    _: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    return await post(`${endpoint}/${id}/clone`);
  },
  getGitRemoteRefs: async (
    { state, commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/git/remote-refs`);
    if (JSON.stringify(state.gitRemoteRefs) === JSON.stringify(res?.data)) {
      return;
    }
    commit('setGitRemoteRefs', res?.data || []);
    return res;
  },
  getCurrentBranch: async (
    { state, commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/branches/current`);
    if (JSON.stringify(state.currentBranch) === JSON.stringify(res?.data))
      return;
    commit('setCurrentBranch', res?.data);
    return res;
  },
  getBranches: async (
    { state, commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/branches`);
    if (JSON.stringify(state.gitBranches) === JSON.stringify(res?.data)) return;
    commit('setGitBranches', res?.data || []);
    return res;
  },
  getRemoteBranches: async (
    { state, commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/branches/remote`);
    if (JSON.stringify(state.gitRemoteBranches) === JSON.stringify(res?.data)) {
      return;
    }
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
    { state, commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/changes`);
    if (JSON.stringify(state.gitChanges) === JSON.stringify(res?.data)) return;
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
    { state, commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/logs`);
    if (JSON.stringify(state.gitLogs) === JSON.stringify(res?.data)) return;
    commit('setGitLogs', res?.data || []);
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
  gitFileDiff: async (
    { state, commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/files/diff`, {
      path: state.activeFilePath,
    });
    commit('setGitDiff', res?.data);
    return res;
  },
  clickCreateSpider: async (
    { state, commit }: StoreActionContext<GitStoreState>,
    item?: FileNavItem
  ) => {
    if (state.createSpiderLoading) return;
    commit('setActiveFileNavItem', item);
    commit('spider/resetForm', undefined, { root: true });
    commit(`showDialog`, 'createSpider');
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
