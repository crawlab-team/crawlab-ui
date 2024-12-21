export declare global {
  interface FileEditorOptions {
    theme: 'vs' | 'vs-dark' | 'hc-black';
  }

  interface FileEditorStyles {
    default: FileEditorStyle;
    active: FileEditorStyle;
  }

  interface FileEditorStyle {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
  }
}
