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

interface LinkTagProps extends TagProps {
  path?: string;
}

declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<LinkTagProps>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<__VLS_TypePropsToOption<LinkTagProps>>
  >,
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
