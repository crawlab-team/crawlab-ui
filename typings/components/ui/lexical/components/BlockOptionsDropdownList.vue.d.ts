import { LexicalEditor } from 'lexical';

declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    visible?: boolean;
    editor: LexicalEditor;
    toolbarRef: HTMLDivElement | null;
    buttonRef: HTMLButtonElement | null;
    blockType: BlockType;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    hide: () => void;
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
        blockType: BlockType;
      }>
    >
  > & {
    onHide?: (() => any) | undefined;
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
