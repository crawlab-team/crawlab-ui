import { Dayjs } from 'dayjs';

export declare global {
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

  type RangeItemValue = RangeItemValueFunc | DateRange;
  type RangeItemValueFunc = () => DateRange;
  type RangeItemKey = 'custom' | string;
  type RangePickerType = 'daterange' | 'datetimerange';
}
