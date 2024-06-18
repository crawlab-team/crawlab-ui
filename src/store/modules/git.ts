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
import { translate } from '@/utils';
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
  gitChangeSelection: [],
  gitRemoteRefs: [],
  gitBranches: [],
  gitTags: [],
  gitRefType: GIT_REF_TYPE_BRANCH,
  gitCurrentBranchLoading: false,
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
  resetAll: (state: GitStoreState) => {
    state.gitData = {};
    state.gitChangeSelection = [];
    state.gitRemoteRefs = [];
    state.gitBranches = [];
    state.gitTags = [];
    state.gitCurrentBranchLoading = false;
  },
  setGitData(state: GitStoreState, gitData: GitData) {
    state.gitData = gitData;
  },
  resetGitData: (state: GitStoreState) => {
    state.gitData = {};
  },
  setGitChangeSelection: (state: GitStoreState, selection: GitChange[]) => {
    debugger;
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
  setGitBranches: (state: GitStoreState, refs: GitRef[]) => {
    state.gitBranches = refs;
  },
  resetGitBranches: (state: GitStoreState) => {
    state.gitBranches = [];
  },
  setGitTags: (state: GitStoreState, refs: GitRef[]) => {
    state.gitTags = refs;
  },
  resetGitTags: (state: GitStoreState) => {
    state.gitTags = [];
  },
  setGitCurrentBranchLoading: (state: GitStoreState, loading: boolean) => {
    state.gitCurrentBranchLoading = loading;
  },
} as GitStoreMutations;

const actions = {
  ...getDefaultStoreActions<Git>('/gits'),
  ...getBaseFileStoreActions<GitStoreState>(endpoint),
  getGit: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    try {
      commit('setGitCurrentBranchLoading', true);
      const res = await get(`${endpoint}/${id}/git`);
      commit('setGitData', res?.data || {});
      return res;
    } finally {
      commit('setGitCurrentBranchLoading', false);
    }
  },
  getGitRemoteRefs: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/git/remote-refs`);
    commit('setGitRemoteRefs', res?.data || []);
    return res;
  },
  getGitBranches: async (
    { commit }: StoreActionContext<GitStoreState>,
    { id }: { id: string }
  ) => {
    const res = await get(`${endpoint}/${id}/git/branches`);
    commit('setGitBranches', res?.data || []);
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
  gitCheckout: async (
    { state }: StoreActionContext<GitStoreState>,
    { id, branch }: { id: string; branch: string }
  ) => {
    const res = await post(`${endpoint}/${id}/git/checkout`, { branch });
    return res;
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
