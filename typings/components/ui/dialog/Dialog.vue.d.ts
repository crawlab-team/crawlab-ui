declare function __VLS_template(): {
  default?(_: {}): any;
  title?(_: {}): any;
  prefix?(_: {}): any;
  suffix?(_: {}): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<{
      visible: boolean;
      modalClass?: string;
      title?: string;
      titleIcon?: Icon;
      top?: string;
      width?: string;
      zIndex?: number;
      confirmDisabled?: boolean;
      confirmLoading?: boolean;
      confirmType?: BasicType;
      className?: string;
    }>,
    {
      top: string;
      confirmType: string;
    }
  >,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    close: () => void;
    confirm: () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<{
          visible: boolean;
          modalClass?: string;
          title?: string;
          titleIcon?: Icon;
          top?: string;
          width?: string;
          zIndex?: number;
          confirmDisabled?: boolean;
          confirmLoading?: boolean;
          confirmType?: BasicType;
          className?: string;
        }>,
        {
          top: string;
          confirmType: string;
        }
      >
    >
  > & {
    onClose?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
  },
  {
    top: string;
    confirmType: BasicType;
  },
  {}
>;
declare const _default: __VLS_WithTemplateSlots<
  typeof __VLS_component,
  ReturnType<typeof __VLS_template>
>;
export default _default;
type __VLS_WithDefaults<P, D> = {
  [K in keyof Pick<P, keyof P>]: K extends keyof D
    ? __VLS_Prettify<
        P[K] & {
          default: D[K];
        }
      >
    : P[K];
};
type __VLS_Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
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
