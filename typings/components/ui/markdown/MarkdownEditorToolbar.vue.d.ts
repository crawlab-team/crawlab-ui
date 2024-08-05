import * as monaco from 'monaco-editor';

declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    editor?: monaco.editor.IStandaloneCodeEditor;
    content?: string;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    undo: () => void;
    redo: () => void;
    bold: () => void;
    italic: () => void;
    underline: () => void;
    strikethrough: () => void;
    link: () => void;
    variable: (value: VariableForm) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        editor?: monaco.editor.IStandaloneCodeEditor;
        content?: string;
      }>
    >
  > & {
    onVariable?: ((value: VariableForm) => any) | undefined;
    onLink?: (() => any) | undefined;
    onStrikethrough?: (() => any) | undefined;
    onItalic?: (() => any) | undefined;
    onBold?: (() => any) | undefined;
    onRedo?: (() => any) | undefined;
    onUndo?: (() => any) | undefined;
    onUnderline?: (() => any) | undefined;
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
