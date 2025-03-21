import { GetterTree } from 'vuex';

declare global {
  interface BaseFileStoreState {
    fileNavItems: FileNavItem[];
    activeFileNavItem?: FileNavItem;
    fileContent: string;
    defaultFilePaths: string[];
    editorFileContentCache: Record<string, string>;
  }

  interface BaseFileStoreGetters
    extends GetterTree<BaseFileStoreState, RootStoreState> {
    fileContent: StoreGetter<BaseFileStoreState, string>;
  }

  interface BaseFileStoreMutations<S> {
    setFileNavItems: StoreMutation<S, FileNavItem[]>;
    resetFileNavItems: StoreMutation<S>;
    setActiveFileNavItem: StoreMutation<S, FileNavItem>;
    resetActiveFileNavItem: StoreMutation<S>;
    setFileContent: StoreMutation<S, string>;
    resetFileContent: StoreMutation<S>;
    setDefaultFilePaths: StoreMutation<S, string[]>;
    resetDefaultFilePaths: StoreMutation<S>;
    setEditorFileContentCache: StoreMutation<
      S,
      { path: string; content: string }
    >;
    resetEditorFileContentCache: StoreMutation<FileStoreState>;
  }

  interface BaseFileStoreActions<S> {
    listDir: StoreAction<S, FileRequestPayload>;
    getFile: StoreAction<S, FileRequestPayload>;
    getFileInfo: StoreAction<S, FileRequestPayload>;
    saveFile: StoreAction<S, FileRequestPayload>;
    saveFileBinary: StoreAction<S, FileRequestPayload>;
    saveFilesBinary: StoreAction<S, SaveFilesRequestPayload>;
    saveDir: StoreAction<S, FileRequestPayload>;
    renameFile: StoreAction<S, FileRequestPayload>;
    deleteFile: StoreAction<S, FileRequestPayload>;
    copyFile: StoreAction<S, FileRequestPayload>;
    exportFiles: StoreAction<S, { id: string }>;
  }
}
