import {Module, MutationTree} from 'vuex';
import {EditorConfiguration} from 'codemirror';

declare global {
  interface FileStoreModule extends Module<FileStoreState, RootStoreState> {
    // getters: FileStoreGetters;
    mutations: FileStoreMutations;
  }

  interface FileStoreState {
    editorOptions: FileEditorConfiguration;
    editorSettingsDialogVisible: boolean;
    editorCreateWithAiDialogVisible: boolean;
    editorFileNavItem?: FileNavItem;
  }

  // interface FileStoreGetters extends GetterTree<FileStoreState, RootStoreState> {
  // }

  interface FileStoreMutations extends MutationTree<FileStoreState> {
    setEditorOptions: StoreMutation<FileStoreState, EditorConfiguration>;
    resetEditorOptions: StoreMutation<FileStoreState>;
    setEditorSettingsDialogVisible: StoreMutation<FileStoreState, boolean>;
    setEditorCreateWithAiDialogVisible: StoreMutation<FileStoreState, boolean>;
    resetEditorFileNavItem: StoreMutation<FileStoreState>;
    setEditorFileNavItem: StoreMutation<FileStoreState, FileNavItem>;
  }
}
