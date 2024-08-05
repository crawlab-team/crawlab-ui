export interface NavActionBackProps {
  buttonType?: ButtonType;
  label?: string;
  tooltip?: string;
  icon?: Icon;
  type?: BasicType;
  size?: BasicSize;
  disabled?: boolean;
}

declare const _default: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<NavActionBackProps>,
    {
      buttonType: string;
      label: string;
      icon: () => string[];
      type: string;
      size: string;
      disabled: boolean;
    }
  >,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    click: () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<NavActionBackProps>,
        {
          buttonType: string;
          label: string;
          icon: () => string[];
          type: string;
          size: string;
          disabled: boolean;
        }
      >
    >
  > & {
    onClick?: (() => any) | undefined;
  },
  {
    label: string;
    disabled: boolean;
    type: BasicType;
    icon: Icon;
    size: BasicSize;
    buttonType: ButtonType;
  },
  {}
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
