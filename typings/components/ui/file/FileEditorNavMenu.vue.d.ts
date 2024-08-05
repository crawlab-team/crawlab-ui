declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    loading?: boolean;
    navMenuCollapsed?: boolean;
    activeItem?: FileNavItem;
    items: FileNavItem[];
    defaultExpandAll: boolean;
    defaultExpandedKeys: string[];
    styles?: FileEditorStyles;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'node-click': (item: FileNavItem) => void;
    'node-db-click': (item: FileNavItem) => void;
    'ctx-menu-new-file': (item: FileNavItem, name: string) => void;
    'ctx-menu-new-directory': (item: FileNavItem, name: string) => void;
    'ctx-menu-upload-files': (item: FileNavItem) => void;
    'ctx-menu-rename': (item: FileNavItem, name: string) => void;
    'ctx-menu-clone': (item: FileNavItem, name: string) => void;
    'ctx-menu-delete': (item: FileNavItem) => void;
    'node-drop': (draggingItem: FileNavItem, dropItem: FileNavItem) => void;
    'drop-files': (files: InputFile[]) => void;
    search: (value: string) => void;
    'toggle-nav-menu': () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        loading?: boolean;
        navMenuCollapsed?: boolean;
        activeItem?: FileNavItem;
        items: FileNavItem[];
        defaultExpandAll: boolean;
        defaultExpandedKeys: string[];
        styles?: FileEditorStyles;
      }>
    >
  > & {
    onSearch?: ((value: string) => any) | undefined;
    'onNode-click'?: ((item: FileNavItem) => any) | undefined;
    'onNode-db-click'?: ((item: FileNavItem) => any) | undefined;
    'onNode-drop'?:
      | ((draggingItem: FileNavItem, dropItem: FileNavItem) => any)
      | undefined;
    'onCtx-menu-new-file'?:
      | ((item: FileNavItem, name: string) => any)
      | undefined;
    'onCtx-menu-new-directory'?:
      | ((item: FileNavItem, name: string) => any)
      | undefined;
    'onCtx-menu-rename'?:
      | ((item: FileNavItem, name: string) => any)
      | undefined;
    'onCtx-menu-clone'?: ((item: FileNavItem, name: string) => any) | undefined;
    'onCtx-menu-delete'?: ((item: FileNavItem) => any) | undefined;
    'onDrop-files'?: ((files: InputFile[]) => any) | undefined;
    'onCtx-menu-upload-files'?: ((item: FileNavItem) => any) | undefined;
    'onToggle-nav-menu'?: (() => any) | undefined;
  },
  {},
  {}
>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
  [K in keyof T]-?: {} extends Pick<T, K>
    ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
      }
    : {
        type: import('vue').PropType<T[K]>;
        required: true;
      };
};
