import type { LexicalEditor } from 'lexical';

declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    editor: LexicalEditor;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    change: (value: { url: string | null; prevUrl: string | null }) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        editor: LexicalEditor;
      }>
    >
  > & {
    onChange?:
      | ((value: { url: string | null; prevUrl: string | null }) => any)
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
