declare function __VLS_template(): {
  default?(_: { item: DraggableItemData }): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    item: DraggableItemData;
    dragging?: boolean;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'd-start': (item: DraggableItemData) => void;
    'd-end': (item: DraggableItemData) => void;
    'd-enter': (item: DraggableItemData) => void;
    'd-leave': (item: DraggableItemData) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        item: DraggableItemData;
        dragging?: boolean;
      }>
    >
  > & {
    'onD-start'?: ((item: DraggableItemData) => any) | undefined;
    'onD-end'?: ((item: DraggableItemData) => any) | undefined;
    'onD-enter'?: ((item: DraggableItemData) => any) | undefined;
    'onD-leave'?: ((item: DraggableItemData) => any) | undefined;
  },
  {},
  {}
>;
declare const _default: __VLS_WithTemplateSlots<
  typeof __VLS_component,
  ReturnType<typeof __VLS_template>
>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
  new (): {
    $slots: S;
  };
};
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
