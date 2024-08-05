declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    ns: ListStoreNamespace;
    content: string;
    navItems: FileNavItem[];
    activeNavItem?: FileNavItem;
    defaultExpandedKeys: string[];
    navMenuLoading?: boolean;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'content-change': (item: string) => void;
    'node-click': (item: FileNavItem) => void;
    'node-db-click': (item: FileNavItem) => void;
    'node-drop': (draggingItem: FileNavItem, dropItem: FileNavItem) => void;
    'ctx-menu-new-file': (item: FileNavItem, name: string) => void;
    'ctx-menu-new-directory': (item: FileNavItem, name: string) => void;
    'ctx-menu-rename': (item: FileNavItem, name: string) => void;
    'ctx-menu-clone': (item: FileNavItem, name: string) => void;
    'ctx-menu-delete': (item: FileNavItem) => void;
    'tab-click': (tab: FileNavItem) => void;
    'save-file': (item: FileNavItem) => void;
    'drop-files': (files: InputFile[]) => void;
    'create-with-ai': (
      name: string,
      sourceCode: string,
      item?: FileNavItem | undefined
    ) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        ns: ListStoreNamespace;
        content: string;
        navItems: FileNavItem[];
        activeNavItem?: FileNavItem;
        defaultExpandedKeys: string[];
        navMenuLoading?: boolean;
      }>
    >
  > & {
    'onTab-click'?: ((tab: FileNavItem) => any) | undefined;
    'onContent-change'?: ((item: string) => any) | undefined;
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
    'onSave-file'?: ((item: FileNavItem) => any) | undefined;
    'onDrop-files'?: ((files: InputFile[]) => any) | undefined;
    'onCreate-with-ai'?:
      | ((
          name: string,
          sourceCode: string,
          item?: FileNavItem | undefined
        ) => any)
      | undefined;
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
