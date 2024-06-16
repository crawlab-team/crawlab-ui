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
    dataDisplayAllFields: boolean;
  }

  type SpiderStoreGetters = BaseStoreGetters<SpiderStoreState>;

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
    setDataDisplayAllFields: StoreMutation<SpiderStoreState, boolean>;
  }

  interface SpiderStoreActions extends BaseStoreActions<Spider> {
    runById: StoreAction<SpiderStoreState, { id: string; options: SpiderRunOptions }>;
    listDir: StoreAction<SpiderStoreState, FileRequestPayload>;
    getFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    getFileInfo: StoreAction<SpiderStoreState, FileRequestPayload>;
    saveFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    saveFileBinary: StoreAction<SpiderStoreState, FileRequestPayload>;
    saveFilesBinary: StoreAction<SpiderStoreState, SaveFilesRequestPayload>;
    saveDir: StoreAction<SpiderStoreState, FileRequestPayload>;
    renameFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    deleteFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    copyFile: StoreAction<SpiderStoreState, FileRequestPayload>;
    exportFiles: StoreAction<SpiderStoreState, { id: string }>;
  }
}
