declare let __VLS_typeProps: {
  visible?: boolean;
};
type __VLS_PublicProps = {
  modelValue: NotificationVariable | undefined;
} & typeof __VLS_typeProps;
declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<__VLS_PublicProps>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'update:modelValue': (modelValue: NotificationVariable | undefined) => void;
    close: () => void;
    confirm: () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_PublicProps>>
  > & {
    onClose?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
    'onUpdate:modelValue'?:
      | ((modelValue: NotificationVariable | undefined) => any)
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
