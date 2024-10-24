<script setup lang="ts">
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { getRangeItemOption } from '@/components/ui/date/date';
import { translate } from '@/utils';

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

interface RangePickerEmits {
  (e: 'change', value?: RangeItem): void;
}

type DateRangePickerProps = RangePickerProps;
type DateRangePickerEmits = RangePickerEmits;

withDefaults(defineProps<DateRangePickerProps>(), {
  type: 'datetimerange',
});

const emit = defineEmits<DateRangePickerEmits>();

const t = translate;

const optionItems = computed<RangeItemOption[]>(
  () =>
    [
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNMinutes', {
          n: 10,
        }),
        'past-10m',
        () => {
          return {
            start: dayjs().subtract(10, 'minute'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNMinutes', {
          n: 30,
        }),
        'past-30m',
        () => {
          return {
            start: dayjs().subtract(30, 'minute'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNHours', { n: 1 }),
        'past-1h',
        () => {
          return {
            start: dayjs().subtract(1, 'hour'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNHours', { n: 3 }),
        'past-3h',
        () => {
          return {
            start: dayjs().subtract(3, 'hour'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNHours', { n: 6 }),
        'past-6h',
        () => {
          return {
            start: dayjs().subtract(6, 'hour'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNHours', { n: 12 }),
        'past-12h',
        () => {
          return {
            start: dayjs().subtract(12, 'hour'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNDays', { n: 1 }),
        'past-1d',
        () => {
          return {
            start: dayjs().subtract(1, 'day'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNDays', { n: 3 }),
        'past-3d',
        () => {
          return {
            start: dayjs().subtract(3, 'day'),
            end: dayjs(),
          };
        }
      ),
      getRangeItemOption(
        t('components.date.dateRangePicker.options.pastNDays', { n: 7 }),
        'past-7d',
        () => {
          return {
            start: dayjs().subtract(7, 'day'),
            end: dayjs(),
          };
        }
      ),
      // {
      //   label: t('components.date.dateRangePicker.options.custom'),
      //   value: {
      //     key: 'custom'
      //   },
      // }
    ] as RangeItemOption[]
);
defineOptions({ name: 'ClDateTimeRangePicker' });
</script>

<template>
  <cl-range-picker
    class-name="date-time-range-picker"
    type="datetimerange"
    :model-value="modelValue"
    :options="optionItems"
    @change="(value: RangeItem) => emit('change', value)"
  />
</template>


