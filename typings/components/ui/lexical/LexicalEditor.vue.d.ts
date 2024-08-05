import '@/components/ui/lexical/theme/default.css';

declare let __VLS_typeProps: {
  markdownContent?: string;
};
type __VLS_PublicProps = {
  modelValue: RichTextPayload;
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
    'update:modelValue': (modelValue: RichTextPayload) => void;
    save: () => void;
    'change-markdown': (value: string) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<__VLS_TypePropsToOption<__VLS_PublicProps>>
  > & {
    onSave?: (() => any) | undefined;
    'onUpdate:modelValue'?: ((modelValue: RichTextPayload) => any) | undefined;
    'onChange-markdown'?: ((value: string) => any) | undefined;
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
