declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    visible?: boolean;
    options: EditorOption[];
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
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        visible?: boolean;
        options: EditorOption[];
        toolbarRef: HTMLDivElement | null;
        buttonRef: HTMLButtonElement | null;
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
