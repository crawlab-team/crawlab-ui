import { LexicalEditor } from 'lexical';

declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    visible?: boolean;
    editor: LexicalEditor;
    toolbarRef: HTMLDivElement | null;
    buttonRef: HTMLButtonElement | null;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    hide: () => void;
    insertVariable: () => void;
    insertTable: () => void;
    insertImage: () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        visible?: boolean;
        editor: LexicalEditor;
        toolbarRef: HTMLDivElement | null;
        buttonRef: HTMLButtonElement | null;
      }>
    >
  > & {
    onHide?: (() => any) | undefined;
    onInsertVariable?: (() => any) | undefined;
    onInsertTable?: (() => any) | undefined;
    onInsertImage?: (() => any) | undefined;
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
