import { FileWithPath } from 'file-selector';

declare global {
  interface BaseFileStoreState {
    fileNavItems: FileNavItem[];
    activeNavItem?: FileNavItem;
    fileMode: FileUploadMode;
    files: FileWithPath[];
    fileContent: string;
    defaultFilePaths: string[];
  }

  interface BaseFileStoreMutations<S> {
    setFileNavItems: StoreMutation<S, FileNavItem[]>;
    setActiveFileNavItem: StoreMutation<S, FileNavItem>;
    resetActiveFileNavItem: StoreMutation<S>;
    setFileMode: StoreMutation<S, string>;
    resetFileMode: StoreMutation<S>;
    setFiles: StoreMutation<S, FileWithPath[]>;
    resetFiles: StoreMutation<S>;
    setFileContent: StoreMutation<S, string>;
    resetFileContent: StoreMutation<S>;
    setDefaultFilePaths: StoreMutation<S, string[]>;
    resetDefaultFilePaths: StoreMutation<S>;
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
