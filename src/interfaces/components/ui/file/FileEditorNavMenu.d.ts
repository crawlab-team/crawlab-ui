export declare global {
  interface FileEditorNavMenuCache<T = any> {
    [key: string]: T;
  }

  interface FileNavItem {
    id?: string;
    is_dir?: boolean;
    path?: string;
    name?: string;
    extension?: string;
    children?: FileNavItem[];
  }

  interface FileEditorNavMenuClickStatus {
    clicked: boolean;
    item?: FileNavItem;
  }
}
