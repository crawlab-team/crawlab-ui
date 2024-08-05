import { Dayjs } from 'dayjs';

interface DateRange {
  start: Dayjs;
  end: Dayjs;
}

interface RangeItem {
  key: RangeItemKey;
  value?: DateRange;
}

interface RangeItemOption extends SelectOption {
  value?: RangeItem;
}

type RangeItemKey = 'custom' | string;
type RangePickerType = 'daterange' | 'datetimerange';

interface RangePickerProps {
  className?: string;
  type?: RangePickerType;
  modelValue?: RangeItem;
  options?: RangeItemOption[];
}

declare const _default: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<RangePickerProps>,
    {
      type: string;
    }
  >,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    change: (value?: RangeItem | undefined) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<RangePickerProps>,
        {
          type: string;
        }
      >
    >
  > & {
    onChange?: ((value?: RangeItem | undefined) => any) | undefined;
  },
  {
    type: RangePickerType;
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
