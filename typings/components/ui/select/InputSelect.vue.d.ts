declare let __VLS_typeProps: {
  options?: SelectOption[];
  placeholder?: string;
};
type __VLS_PublicProps = {
  modelValue?: string[];
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
    'update:modelValue': (modelValue: string[]) => void;
    change: (value: string[]) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_PublicProps>>
  > & {
    onChange?: ((value: string[]) => any) | undefined;
    'onUpdate:modelValue'?: ((modelValue: string[]) => any) | undefined;
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
