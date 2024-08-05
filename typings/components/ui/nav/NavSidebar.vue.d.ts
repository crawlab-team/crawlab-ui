declare const _default: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<{
      type?: NavSidebarType;
      collapsed?: boolean;
      showActions?: boolean;
      items?: NavItem[];
      activeKey?: string;
      showCheckbox?: boolean;
      defaultCheckedKeys?: string[];
      defaultExpandedKeys?: string[];
      defaultExpandAll?: boolean;
      noSearch?: boolean;
    }>,
    {
      type: string;
      collapsed: boolean;
      showActions: boolean;
      items: () => never[];
      activeKey: string;
      showCheckbox: boolean;
      defaultCheckedKeys: () => never[];
      defaultExpandedKeys: () => never[];
      defaultExpandAll: boolean;
      noSearch: boolean;
    }
  >,
  {
    scroll: (id: string) => void;
  },
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
      items: NavItem<any>[]
    ) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<{
          type?: NavSidebarType;
          collapsed?: boolean;
          showActions?: boolean;
          items?: NavItem[];
          activeKey?: string;
          showCheckbox?: boolean;
          defaultCheckedKeys?: string[];
          defaultExpandedKeys?: string[];
          defaultExpandAll?: boolean;
          noSearch?: boolean;
        }>,
        {
          type: string;
          collapsed: boolean;
          showActions: boolean;
          items: () => never[];
          activeKey: string;
          showCheckbox: boolean;
          defaultCheckedKeys: () => never[];
          defaultExpandedKeys: () => never[];
          defaultExpandAll: boolean;
          noSearch: boolean;
        }
      >
    >
  > & {
    onSelect?: ((item: NavItem<any>) => any) | undefined;
    onCheck?:
      | ((item: NavItem<any>, checked: boolean, items: NavItem<any>[]) => any)
      | undefined;
  },
  {
    type: NavSidebarType;
    defaultExpandedKeys: string[];
    defaultExpandAll: boolean;
    collapsed: boolean;
    activeKey: string;
    items: NavItem[];
    defaultCheckedKeys: string[];
    showCheckbox: boolean;
    showActions: boolean;
    noSearch: boolean;
  },
  {}
>;
export default _default;
type __VLS_WithDefaults<P, D> = {
  [K in keyof Pick<P, keyof P>]: K extends keyof D
    ? __VLS_Prettify<
        P[K] & {
          default: D[K];
        }
      >
    : P[K];
};
type __VLS_Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
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
