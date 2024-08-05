declare function __VLS_template(): {
  reference?(_: {}): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    visible?: boolean;
    column: TableColumn;
    actionStatusMap: TableHeaderActionStatusMap;
    sort?: SortData;
    filter?: TableHeaderDialogFilterData;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    click: (value: TableHeaderDialogValue) => void;
    cancel: () => void;
    clear: () => void;
    apply: (value: TableHeaderDialogValue) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        visible?: boolean;
        column: TableColumn;
        actionStatusMap: TableHeaderActionStatusMap;
        sort?: SortData;
        filter?: TableHeaderDialogFilterData;
      }>
    >
  > & {
    onClick?: ((value: TableHeaderDialogValue) => any) | undefined;
    onCancel?: (() => any) | undefined;
    onClear?: (() => any) | undefined;
    onApply?: ((value: TableHeaderDialogValue) => any) | undefined;
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
