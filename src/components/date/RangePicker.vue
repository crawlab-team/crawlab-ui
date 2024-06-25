<script setup lang="ts">
defineOptions({ name: 'ClRangePicker' });
import { computed, onBeforeMount, ref, watch } from 'vue';
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

interface RangePickerEmits {
  (e: 'change', value?: RangeItem): void;
}

const props = withDefaults(defineProps<RangePickerProps>(), {
  type: 'daterange',
});

const emit = defineEmits<RangePickerEmits>();

const internalValue = ref<RangeItem>();
const internalRange = ref<DateRange>();

const selectedValue = computed<RangeItem | undefined>(() => {
  return props.options?.find(op => op.value?.key === props.modelValue?.key)
    ?.value;
});

const onChange = () => {
  emit('change', internalValue.value);
};

const updateInternalValue = () => {
  internalValue.value = selectedValue.value;
};
onBeforeMount(updateInternalValue);
watch(() => props.modelValue, updateInternalValue);

watch(
  () => internalRange.value,
  () => {
    if (!internalValue.value) return;
    internalValue.value.value = internalRange.value;
  }
);
</script>

<template>
  <div class="range-picker" :class="className">
    <el-select v-model="internalValue" @change="onChange">
      <el-option
        v-for="(op, $index) in options"
        :key="$index"
        :label="op.label"
        :value="op.value"
      />
    </el-select>
    <el-date-picker
      v-if="internalValue?.key === 'custom'"
      v-model="internalRange"
      :type="type"
      @change="onChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.range-picker {
  display: flex;
  align-items: center;

  .el-select {
    margin-right: 10px;
  }
}
</style>
