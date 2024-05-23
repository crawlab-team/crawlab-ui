interface FileEditorNavMenuProps {
  activeItem?: FileNavItem;
  items: FileNavItem[];
  defaultExpandAll: boolean;
  defaultExpandedKeys: string[];
  styles?: FileEditorStyles;
}

interface FileEditorNavMenuClickStatus {
  clicked: boolean;
  item?: FileNavItem;
}

interface FileEditorNavMenuCache<T = any> {
  [key: string]: T;
}
