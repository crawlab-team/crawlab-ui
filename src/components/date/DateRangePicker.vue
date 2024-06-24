<script setup lang="ts">
defineOptions({ name: 'ClDateRangePicker' });
import { computed } from 'vue';
import {
  RangeItem,
  RangePickerEmits,
  RangePickerProps,
} from '@/components/date/RangePicker.vue';
import dayjs from 'dayjs';
import { translate } from '@/utils';

type DateRangePickerProps = RangePickerProps;

type DateRangePickerEmits = RangePickerEmits;

withDefaults(defineProps<DateRangePickerProps>(), {
  type: 'daterange',
});

const emit = defineEmits<DateRangePickerEmits>();

const t = translate;

const optionItems = computed<RangeItem[]>(() => {
  return [
    {
      key: t('components.date.dateRangePicker.options.today'),
      value: () => {
        return {
          start: dayjs(),
          end: dayjs(),
        };
      },
    },
    {
      key: t('components.date.dateRangePicker.options.yesterday'),
      value: () => {
        return {
          start: dayjs().subtract(1, 'day'),
          end: dayjs().subtract(1, 'day'),
        };
      },
    },
    {
      key: t('components.date.dateRangePicker.options.pastNDays', {
        n: 7,
      }),
      value: () => {
        return {
          start: dayjs().subtract(7, 'day'),
          end: dayjs(),
        };
      },
    },
    {
      key: t('components.date.dateRangePicker.options.pastNDays', {
        n: 14,
      }),
      value: () => {
        return {
          start: dayjs().subtract(14, 'day'),
          end: dayjs(),
        };
      },
    },
    {
      key: t('components.date.dateRangePicker.options.pastNDays', {
        n: 30,
      }),
      value: () => {
        return {
          start: dayjs().subtract(30, 'day'),
          end: dayjs(),
        };
      },
    },
  ].map(
    item =>
      ({
        ...item,
        value: item.value as RangeItemValueFunc | undefined,
      }) as RangeItem
  );
});
</script>

<template>
  <cl-range-picker
    class-name="date-range-picker"
    type="daterange"
    :model-value="modelValue"
    :options="optionItems"
    @change="(value: RangeItem) => emit('change', value)"
  />
</template>

<style lang="scss" scoped></style>
