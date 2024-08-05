import { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';

declare const _default: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<{
      type: keyof ChartTypeRegistry;
      data?: ChartData;
      options?: ChartOptions;
      height?: string | number;
      width?: string | number;
      minHeight?: string | number;
      minWidth?: string | number;
    }>,
    {
      type: string;
      height: string;
      width: string;
      minHeight: string;
      minWidth: string;
    }
  >,
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
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<{
          type: keyof ChartTypeRegistry;
          data?: ChartData;
          options?: ChartOptions;
          height?: string | number;
          width?: string | number;
          minHeight?: string | number;
          minWidth?: string | number;
        }>,
        {
          type: string;
          height: string;
          width: string;
          minHeight: string;
          minWidth: string;
        }
      >
    >
  >,
  {
    type: keyof ChartTypeRegistry;
    width: string | number;
    minWidth: string | number;
    height: string | number;
    minHeight: string | number;
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
