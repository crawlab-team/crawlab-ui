declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    stat?: SpiderStat;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'tasks-click': () => void;
    'results-click': () => void;
    'duration-click': () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        stat?: SpiderStat;
      }>
    >
  > & {
    'onTasks-click'?: (() => any) | undefined;
    'onResults-click'?: (() => any) | undefined;
    'onDuration-click'?: (() => any) | undefined;
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
