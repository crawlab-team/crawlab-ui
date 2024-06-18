const getDefaultEditorOptions = (): FileEditorOptions => {
  try {
    const options = JSON.parse(
      localStorage.getItem('fileEditorOptions') || 'null'
    );
    if (options) {
      return options;
    }
  } catch (e) {}
  const options: FileEditorOptions = {
    theme: 'vs-dark',
  };
  localStorage.setItem('fileEditorOptions', JSON.stringify(options));
  return options;
};

export default {
  namespaced: true,
  state: {
    editorOptions: getDefaultEditorOptions(),
    editorSettingsDialogVisible: false,
    editorCreateWithAiDialogVisible: false,
    editorFileNavItem: undefined,
  },
  mutations: {
    setEditorOptions: (state: FileStoreState, options: FileEditorOptions) => {
      for (const k in options) {
        const key = k as keyof FileEditorOptions;
        state.editorOptions[key] = options[key];
      }
      localStorage.setItem(
        'fileEditorOptions',
        JSON.stringify(state.editorOptions)
      );
    },
    resetEditorOptions: (state: FileStoreState) => {
      state.editorOptions = getDefaultEditorOptions();
    },
    setEditorSettingsDialogVisible: (state: FileStoreState, value: boolean) => {
      state.editorSettingsDialogVisible = value;
    },
    setEditorCreateWithAiDialogVisible: (
      state: FileStoreState,
      value: boolean
    ) => {
      state.editorCreateWithAiDialogVisible = value;
    },
    resetEditorFileNavItem: (state: FileStoreState) => {
      state.editorFileNavItem = undefined;
    },
    setEditorFileNavItem: (state: FileStoreState, value: FileNavItem) => {
      state.editorFileNavItem = value;
    },
  },
  actions: {},
} as FileStoreModule;
