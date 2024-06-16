type GitStoreModule = BaseModule<GitStoreState, GitStoreGetters, GitStoreMutations, GitStoreActions>;

interface GitStoreState extends BaseStoreState<Git> {
  gitData?: GitData;
  gitCurrentBranchLoading: boolean;
  gitChangeSelection: TableData<GitChange>;
  gitRemoteRefs: GitRef[];
  gitBranches: GitRef[];
  gitTags: GitRef[];
}

interface GitStoreGetters extends BaseStoreGetters<Git> {
  gitLogsMap: StoreGetter<GitStoreState, Map<string, GitLog>>;
  gitBranchSelectOptions: StoreGetter<GitStoreState, SelectOption[]>;

  [key: string]: any;
}

interface GitStoreMutations extends BaseStoreMutations<Git> {
  resetAll: StoreMutation<GitStoreState>;
  setGitData: StoreMutation<GitStoreState, GitData>;
  resetGitData: StoreMutation<GitStoreState>;
  setGitChangeSelection: StoreMutation<GitStoreState, GitChange[]>;
  resetGitChangeSelection: StoreMutation<GitStoreState>;
  setGitRemoteRefs: StoreMutation<GitStoreState, GitRef[]>;
  resetGitRemoteRefs: StoreMutation<GitStoreState>;
  setGitBranches: StoreMutation<GitStoreState, GitRef[]>;
  resetGitBranches: StoreMutation<GitStoreState>;
  setGitTags: StoreMutation<GitStoreState, GitRef[]>;
  resetGitTags: StoreMutation<GitStoreState>;
  setGitCurrentBranchLoading: StoreMutation<GitStoreState, boolean>;
}

interface GitStoreActions extends BaseStoreActions<Git> {
  getGit: StoreAction<GitStoreState, { id: string }>;
  getGitRemoteRefs: StoreAction<GitStoreState, { id: string }>;
  getGitBranches: StoreAction<GitStoreState, { id: string }>;
  getGitTags: StoreAction<GitStoreState, { id: string }>;
  gitCheckout: StoreAction<GitStoreState, { id: string; branch: string }>;
  gitPull: StoreAction<GitStoreState, { id: string }>;
  gitCommit: StoreAction<GitStoreState, { id: string; commit_message: string }>;
}
