import {FileWithPath} from 'file-selector';

declare global {
  type SpiderStoreModule = BaseModule<SpiderStoreState, SpiderStoreGetters, SpiderStoreMutations, SpiderStoreActions>;

  interface SpiderStoreState extends BaseStoreState<Spider> {
    fileNavItems: FileNavItem[];
    activeNavItem?: FileNavItem;
    fileMode: FileUploadMode;
    files: FileWithPath[];
    fileContent: string;
    defaultFilePaths: string[];
    currentGitBranch: string;
    gitData: GitData;
    gitChangeSelection: TableData<GitChange>;
    gitRemoteRefs: GitRef[];
    gitRefType: string;
  }

  interface SpiderStoreGetters extends BaseStoreGetters<SpiderStoreState> {
    gitLogsMap: StoreGetter<SpiderStoreState, Map<string, GitLog>>;
  }

  interface SpiderStoreMutations extends BaseStoreMutations<Spider> {
    setFileNavItems: StoreMutation<SpiderStoreState, FileNavItem[]>;
    setActiveFileNavItem: StoreMutation<SpiderStoreState, FileNavItem>;
    resetActiveFileNavItem: StoreMutation<SpiderStoreState>;
    setFileMode: StoreMutation<SpiderStoreState, string>;
    resetFileMode: StoreMutation<SpiderStoreState>;
    setFiles: StoreMutation<SpiderStoreState, FileWithPath[]>;
    resetFiles: StoreMutation<SpiderStoreState>;
    setFileContent: StoreMutation<SpiderStoreState, string>;
    resetFileContent: StoreMutation<SpiderStoreState>;
    setDefaultFilePaths: StoreMutation<SpiderStoreState, string[]>;
    resetDefaultFilePaths: StoreMutation<SpiderStoreState>;
    setCurrentGitBranch: StoreMutation<SpiderStoreState, string>;
    resetCurrentGitBranch: StoreMutation<SpiderStoreState>;
    setGitData: StoreMutation<SpiderStoreState, GitData>;
    resetGitData: StoreMutation<SpiderStoreState>;
    setGitChangeSelection: StoreMutation<SpiderStoreState, GitChange[]>;
    resetGitChangeSelection: StoreMutation<SpiderStoreState>;
    setGitRemoteRefs: StoreMutation<SpiderStoreState, GitRef[]>;
    resetGitRemoteRefs: StoreMutation<SpiderStoreState>;
    setGitRefType: StoreMutation<SpiderStoreState, string>;
    resetGitRefType: StoreMutation<SpiderStoreState>;
  }

  interface SpiderStoreActions extends BaseStoreActions<Spider> {
    runById: StoreAction<SpiderStoreState, { id: string; options: SpiderRunOptions }>;
    listDir: StoreAction<SpiderStoreState, FileRequestPayload>;
    getFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    getFileInfo: StoreAction<SpiderStoreState, FileRequestPayload>;
    saveFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    saveFileBinary: StoreAction<SpiderStoreState, FileRequestPayload>;
    saveDir: StoreAction<SpiderStoreState, FileRequestPayload>;
    renameFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    deleteFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    copyFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    getGit: StoreAction<SpiderStoreState, { id: string }>;
    getGitRemoteRefs: StoreAction<SpiderStoreState, { id: string }>;
    gitPull: StoreAction<SpiderStoreState, { id: string; branch: string }>;
    gitCommit: StoreAction<SpiderStoreState, { id: string; commit_message: string }>;
  }
}
