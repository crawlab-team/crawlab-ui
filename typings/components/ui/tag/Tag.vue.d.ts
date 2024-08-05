interface TagProps {
  label?: string;
  tooltip?: string;
  type?: BasicType;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  icon?: Icon;
  suffixIcon?: Icon;
  size?: BasicSize;
  spinning?: boolean;
  width?: string;
  effect?: BasicEffect;
  clickable?: boolean;
  closable?: boolean;
  disabled?: boolean;
  className?: string;
}

declare function __VLS_template(): {
  tooltip?(_: {}): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  __VLS_TypePropsToOption<TagProps>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    click: () => void;
    close: () => void;
    mouseenter: () => void;
    mouseleave: () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<__VLS_TypePropsToOption<TagProps>>
  > & {
    onClick?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    onMouseenter?: (() => any) | undefined;
    onMouseleave?: (() => any) | undefined;
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
