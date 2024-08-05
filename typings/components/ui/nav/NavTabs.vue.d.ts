declare function __VLS_template(): {
  extra?(_: {}): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    items?: NavItem[];
    activeKey?: string;
    collapsed?: boolean;
    toggle?: boolean;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    select: (index: string) => void;
    toggle: () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        items?: NavItem[];
        activeKey?: string;
        collapsed?: boolean;
        toggle?: boolean;
      }>
    >
  > & {
    onSelect?: ((index: string) => any) | undefined;
    onToggle?: (() => any) | undefined;
  },
  {},
  {}
>;
declare const _default: __VLS_WithTemplateSlots<
  typeof __VLS_component,
  ReturnType<typeof __VLS_template>
>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
  new (): {
    $slots: S;
  };
};
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
