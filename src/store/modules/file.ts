import {EditorConfiguration} from 'codemirror';

const getDefaultEditorTheme = () => 'darcula';

const getDefaultEditorOptions = (): FileEditorConfiguration => {
  return {
    // settings
    theme: getDefaultEditorTheme(),
    indentUnit: 2,
    smartIndent: true,
    tabSize: 4,
    indentWithTabs: false,
    electricChars: true,
    keyMap: 'default',
    lineWrapping: false,
    lineNumbers: false,
    showCursorWhenSelecting: false,
    lineWiseCopyCut: true,
    pasteLinesPerSelection: true,
    undoDepth: 40,
    cursorBlinkRate: 530,
    cursorScrollMargin: 0,
    cursorHeight: 1,
    maxHighlightLength: 10000,
    spellcheck: false,
    autocorrect: false,
    autocapitalize: false,

    // internal
    readOnly: false,
    lint: false,
    search: {
      bottom: true,
    },

    // addons
    highlightSelectionMatches: true,
    matchBrackets: true,
    matchTags: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    showHint: true,
  };
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
    setEditorOptions: (state: FileStoreState, options: EditorConfiguration) => {
      for (const k in options) {
        const key = k as keyof EditorConfiguration;
        state.editorOptions[key] = options[key];
      }
    },
    resetEditorOptions: (state: FileStoreState) => {
      state.editorOptions = getDefaultEditorOptions();
    },
    setEditorSettingsDialogVisible: (state: FileStoreState, value: boolean) => {
      state.editorSettingsDialogVisible = value;
    },
    setEditorCreateWithAiDialogVisible: (state: FileStoreState, value: boolean) => {
      state.editorCreateWithAiDialogVisible = value;
    },
    resetEditorFileNavItem: (state: FileStoreState) => {
      state.editorFileNavItem = undefined;
    },
    setEditorFileNavItem: (state: FileStoreState, value: FileNavItem) => {
      state.editorFileNavItem = value;
    },
  },
  actions: {}
} as FileStoreModule;
