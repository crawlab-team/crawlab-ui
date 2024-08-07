declare function __VLS_template(): {
  header?(_: {}): any;
  footer?(_: {}): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  {},
  {
    validate: () => Promise<void>;
  },
  {},
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<import('vue').ExtractPropTypes<{}>>,
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
