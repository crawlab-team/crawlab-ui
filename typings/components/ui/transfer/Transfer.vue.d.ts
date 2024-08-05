declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    value: string[];
    data: DraggableItemData[];
    titles?: string[];
    buttonTexts?: string[];
    buttonTooltips?: string[];
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    change: (value: string[]) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        value: string[];
        data: DraggableItemData[];
        titles?: string[];
        buttonTexts?: string[];
        buttonTooltips?: string[];
      }>
    >
  > & {
    onChange?: ((value: string[]) => any) | undefined;
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
