declare let __VLS_typeProps: {
  options: SelectOption[];
};
type __VLS_PublicProps = {
  modelValue?: any;
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
    'update:modelValue': (modelValue: any) => void;
    select: (value: string) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_PublicProps>>
  > & {
    onSelect?: ((value: string) => any) | undefined;
    'onUpdate:modelValue'?: ((modelValue: any) => any) | undefined;
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
