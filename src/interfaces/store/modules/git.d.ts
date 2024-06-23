type GitStoreModule = BaseModule<
  GitStoreState,
  GitStoreGetters,
  GitStoreMutations,
  GitStoreActions
>;

interface GitStoreState extends BaseStoreState<Git>, BaseFileStoreState {
  activeDialogKey?: DialogKey | 'createBranch';
  gitData?: GitData;
  gitDataLoading: boolean;
  gitChangeSelection: TableData<GitChange>;
  gitRemoteRefs: GitRef[];
  currentBranch?: GitRef;
  gitBranches: GitRef[];
  gitRemoteBranches: GitRef[];
  gitChanges: GitChange[];
  gitLogs: GitLog[];
  gitTags: GitRef[];
}

interface GitStoreGetters extends BaseStoreGetters<Git> {
  gitLogsMap: StoreGetter<GitStoreState, Map<string, GitLog>>;
  gitBranchSelectOptions: StoreGetter<GitStoreState, SelectOption[]>;

  [key: string]: any;
}

interface GitStoreMutations
  extends BaseStoreMutations<Git>,
    BaseFileStoreMutations<GitStoreState> {
  setGitData: StoreMutation<GitStoreState, GitData>;
  resetGitData: StoreMutation<GitStoreState>;
  setGitDataLoading: StoreMutation<GitStoreState, boolean>;
  setGitChangeSelection: StoreMutation<GitStoreState, GitChange[]>;
  resetGitChangeSelection: StoreMutation<GitStoreState>;
  setGitRemoteRefs: StoreMutation<GitStoreState, GitRef[]>;
  resetGitRemoteRefs: StoreMutation<GitStoreState>;
  setCurrentBranch: StoreMutation<GitStoreState, GitRef>;
  resetCurrentBranch: StoreMutation<GitStoreState>;
  setGitBranches: StoreMutation<GitStoreState, GitRef[]>;
  resetGitBranches: StoreMutation<GitStoreState>;
  setGitRemoteBranches: StoreMutation<GitStoreState, GitRef[]>;
  resetGitRemoteBranches: StoreMutation<GitStoreState>;
  setGitChanges: StoreMutation<GitStoreState, GitChange[]>;
  resetGitChanges: StoreMutation<GitStoreState>;
  setGitLogs: StoreMutation<GitStoreState, GitLog[]>;
  resetGitLogs: StoreMutation<GitStoreState>;
  setGitTags: StoreMutation<GitStoreState, GitRef[]>;
  resetGitTags: StoreMutation<GitStoreState>;
}

interface GitStoreActions
  extends BaseStoreActions<Git>,
    BaseFileStoreActions<GitStoreState> {
  getGit: StoreAction<GitStoreState, { id: string }>;
  cloneGit: StoreAction<GitStoreState, { id: string }>;
  getGitRemoteRefs: StoreAction<GitStoreState, { id: string }>;
  getCurrentBranch: StoreAction<GitStoreState, { id: string }>;
  getBranches: StoreAction<GitStoreState, { id: string }>;
  getRemoteBranches: StoreAction<GitStoreState, { id: string }>;
  newBranch: StoreAction<
    GitStoreState,
    { id: string; sourceBranch: string; targetBranch: string }
  >;
  deleteBranch: StoreAction<GitStoreState, { id: string; branch: string }>;
  checkoutBranch: StoreAction<GitStoreState, { id: string; branch: string }>;
  checkoutRemoteBranch: StoreAction<
    GitStoreState,
    { id: string; branch: string }
  >;
  getChanges: StoreAction<GitStoreState, { id: string }>;
  addChanges: StoreAction<GitStoreState, { id: string; changes: GitChange[] }>;
  deleteChanges: StoreAction<
    GitStoreState,
    { id: string; changes: GitChange[] }
  >;
  commit: StoreAction<GitStoreState, { id: string; message: string }>;
  pull: StoreAction<GitStoreState, { id: string }>;
  push: StoreAction<GitStoreState, { id: string }>;
  getLogs: StoreAction<GitStoreState, { id: string }>;
  getGitTags: StoreAction<GitStoreState, { id: string }>;
  gitCheckoutTag: StoreAction<GitStoreState, { id: string; tag: string }>;
  gitPull: StoreAction<GitStoreState, { id: string }>;
  gitCommit: StoreAction<GitStoreState, { id: string; commit_message: string }>;
  createSpider: StoreAction<GitStoreState, { id: string; spider: Spider }>;
}
