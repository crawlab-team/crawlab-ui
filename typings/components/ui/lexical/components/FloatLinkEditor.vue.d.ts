import type { CommandListenerPriority, LexicalEditor } from 'lexical';

declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    editor: LexicalEditor;
    priority: CommandListenerPriority;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        editor: LexicalEditor;
        priority: CommandListenerPriority;
      }>
    >
  >,
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
