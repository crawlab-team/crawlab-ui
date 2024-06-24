export interface FileNavItem {
  id?: string;
  is_dir?: boolean;
  path?: string;
  name?: string;
  extension?: string;
  children?: FileNavItem[];
}

export interface FileEditorStyle {
  backgroundColor?: string;
  color?: string;
}

export interface FileEditorStyles {
  default: FileEditorStyle;
  active: FileEditorStyle;
}

export interface FileEditorOptions {
  theme: 'vs' | 'vs-dark' | 'hc-black';
}

export interface FileWithPath extends File {
  path?: string;
}

export interface FileEditorNavMenuClickStatus {
  clicked: boolean;
  item?: FileNavItem;
}
