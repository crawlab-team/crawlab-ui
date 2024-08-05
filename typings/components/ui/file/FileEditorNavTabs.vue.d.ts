declare function __VLS_template(): {
  prefix?(_: {}): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    activeTab?: FileNavItem;
    tabs?: FileNavItem[];
    styles?: FileEditorStyles;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'tab-click': (item: FileNavItem) => void;
    'tab-close': (item: FileNavItem) => void;
    'tab-close-others': (item: FileNavItem) => void;
    'tab-close-all': () => void;
    'tab-dragend': (items: FileNavItem[]) => void;
    'show-more': () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        activeTab?: FileNavItem;
        tabs?: FileNavItem[];
        styles?: FileEditorStyles;
      }>
    >
  > & {
    'onTab-click'?: ((item: FileNavItem) => any) | undefined;
    'onTab-close'?: ((item: FileNavItem) => any) | undefined;
    'onTab-close-others'?: ((item: FileNavItem) => any) | undefined;
    'onTab-close-all'?: (() => any) | undefined;
    'onTab-dragend'?: ((items: FileNavItem[]) => any) | undefined;
    'onShow-more'?: (() => any) | undefined;
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
