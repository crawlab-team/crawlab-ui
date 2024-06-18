import { Module, MutationTree } from 'vuex';

declare global {
  interface FileStoreModule extends Module<FileStoreState, RootStoreState> {
    mutations: FileStoreMutations;
  }

  interface FileStoreState {
    editorOptions: FileEditorOptions;
    editorSettingsDialogVisible: boolean;
    editorCreateWithAiDialogVisible: boolean;
    editorFileNavItem?: FileNavItem;
  }

  interface FileStoreMutations extends MutationTree<FileStoreState> {
    setEditorOptions: StoreMutation<FileStoreState, FileEditorOptions>;
    resetEditorOptions: StoreMutation<FileStoreState>;
    setEditorSettingsDialogVisible: StoreMutation<FileStoreState, boolean>;
    setEditorCreateWithAiDialogVisible: StoreMutation<FileStoreState, boolean>;
    resetEditorFileNavItem: StoreMutation<FileStoreState>;
    setEditorFileNavItem: StoreMutation<FileStoreState, FileNavItem>;
  }
}
