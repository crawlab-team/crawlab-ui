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

interface CheckTagProps extends TagProps {
  modelValue: boolean;
}

declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<CheckTagProps>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'update:model-value': (value: boolean) => void;
    change: (value: boolean) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<__VLS_TypePropsToOption<CheckTagProps>>
  > & {
    onChange?: ((value: boolean) => any) | undefined;
    'onUpdate:model-value'?: ((value: boolean) => any) | undefined;
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
