declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    visible?: boolean;
    columns?: TableColumn[];
    selectedColumnKeys?: string[];
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    close: () => void;
    change: (value: string[]) => void;
    sort: (value: string[]) => void;
    confirm: (value: string[]) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        visible?: boolean;
        columns?: TableColumn[];
        selectedColumnKeys?: string[];
      }>
    >
  > & {
    onClose?: (() => any) | undefined;
    onChange?: ((value: string[]) => any) | undefined;
    onConfirm?: ((value: string[]) => any) | undefined;
    onSort?: ((value: string[]) => any) | undefined;
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
