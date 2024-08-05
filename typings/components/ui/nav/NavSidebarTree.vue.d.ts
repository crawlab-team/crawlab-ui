declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    activeKey: string;
    items: NavItem[];
    showCheckbox: boolean;
    defaultCheckedKeys: string[];
    defaultExpandedKeys: string[];
    defaultExpandAll: boolean;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    select: (item: NavItem<any>) => void;
    check: (
      item: NavItem<any>,
      checked: boolean,
      checkedNodes: NavItem<any>[]
    ) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        activeKey: string;
        items: NavItem[];
        showCheckbox: boolean;
        defaultCheckedKeys: string[];
        defaultExpandedKeys: string[];
        defaultExpandAll: boolean;
      }>
    >
  > & {
    onSelect?: ((item: NavItem<any>) => any) | undefined;
    onCheck?:
      | ((
          item: NavItem<any>,
          checked: boolean,
          checkedNodes: NavItem<any>[]
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
