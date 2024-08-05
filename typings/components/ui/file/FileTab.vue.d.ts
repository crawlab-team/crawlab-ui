declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    ns: ListStoreNamespace;
    activeId: string;
    content: string;
    navItems: FileNavItem[];
    activeNavItem?: FileNavItem;
    services: FileServices<BaseModel>;
    defaultFilePaths: string[];
    navMenuLoading?: boolean;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'file-change': (value: string) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        ns: ListStoreNamespace;
        activeId: string;
        content: string;
        navItems: FileNavItem[];
        activeNavItem?: FileNavItem;
        services: FileServices<BaseModel>;
        defaultFilePaths: string[];
        navMenuLoading?: boolean;
      }>
    >
  > & {
    'onFile-change'?: ((value: string) => any) | undefined;
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
