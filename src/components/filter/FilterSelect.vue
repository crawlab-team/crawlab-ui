<script setup lang="ts">
defineOptions({ name: 'ClFilterSelect' });
import { computed, onBeforeMount, ref } from 'vue';
import useRequest from '@/services/request';
import { cloneArray, prependAllToSelectOptions } from '@/utils';

const props = defineProps<{
  label?: string;
  placeholder?: string;
  filterable?: boolean;
  options?: SelectOption[];
  optionsRemote?: FilterSelectOptionsRemote;
}>();

const emit = defineEmits<{
  (e: 'change', value: any): void;
}>();

const { get } = useRequest();

const internalModelValue = ref();
const internalOptions = ref<SelectOption[]>([]);

const computedOptions = computed<SelectOption[]>(() => {
  const options = cloneArray(props.options || internalOptions.value || []);
  return prependAllToSelectOptions(options);
});

const onChange = (value: any) => {
  if (value === '') return;
  emit('change', value);
};

const onClear = () => {
  internalModelValue.value = undefined;
  emit('change', undefined);
};

const getOptions = async () => {
  if (!props.optionsRemote) return;
  const { colName, value, label } = props.optionsRemote;
  let url = `/filters/${colName}`;
  if (value) url += `/${value}`;
  if (label) url += `/${label}`;
  const res = await get(url);
  internalOptions.value = res.data;
};

onBeforeMount(getOptions);
</script>

<template>
  <div class="filter-select">
    <label v-if="label" class="label">
      {{ label }}
    </label>
    <el-select
      class="content"
      v-model="internalModelValue"
      :placeholder="placeholder"
      :filterable="filterable"
      clearable
      @clear="onClear"
      @change="onChange"
    >
      <el-option
        v-for="(option, $index) in computedOptions"
        :key="$index"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
.filter-select {
  display: flex;
  align-items: center;
  flex: 1 0 auto;

  .content {
    flex: 1 0 180px;
    width: 180px;
  }
}
</style>
