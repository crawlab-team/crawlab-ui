<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import useRequest from '@/services/request';
import { cloneArray, prependAllToSelectOptions } from '@/utils';
import { debounce } from 'lodash';

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    placeholder?: string;
    filterable?: boolean;
    clearable?: boolean;
    options?: SelectOption[];
    optionsRemote?: FilterSelectOptionsRemote;
    noAllOption?: boolean;
    defaultValue?: any;
  }>(),
  {
    clearable: true,
  }
);

const emit = defineEmits<{
  (e: 'change', value: any): void;
}>();

const { get } = useRequest();

const internalModelValue = ref();
const internalOptions = ref<SelectOption[]>([]);

const computedOptions = computed<SelectOption[]>(() => {
  const options = cloneArray(props.options || internalOptions.value || []);
  if (props.noAllOption) {
    return options;
  }
  return prependAllToSelectOptions(options);
});

const onChange = (value: any) => {
  emit('change', value);
};

const onClear = () => {
  const { options, noAllOption } = props;
  if (noAllOption) {
    internalModelValue.value = options ? options[0]?.value : undefined;
  } else {
    internalModelValue.value = undefined;
  }
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

const initializeModelValue = () => {
  const { options, noAllOption, defaultValue } = props;
  if (typeof defaultValue !== 'undefined') {
    internalModelValue.value = defaultValue;
    return;
  }
  if (noAllOption) {
    internalModelValue.value = options ? options[0]?.value : undefined;
  }
};
onBeforeMount(initializeModelValue);
watch(internalOptions, initializeModelValue);
watch(() => props.defaultValue, initializeModelValue);

const hasIcon = computed(() => {
  return computedOptions.value.some(option => option.icon);
});

const activeOption = computed(() => {
  return computedOptions.value.find(
    option => option.value === internalModelValue.value
  );
});

defineOptions({ name: 'ClFilterSelect' });
</script>

<template>
  <div class="filter-select" :id="id">
    <label v-if="label" class="label">
      {{ label }}
    </label>
    <el-select
      class="content"
      v-model="internalModelValue"
      :placeholder="placeholder"
      :filterable="filterable"
      :clearable="clearable"
      :popper-class="id"
      @change="onChange"
      @clear="onClear"
    >
      <cl-option
        v-for="(option, $index) in computedOptions"
        :key="$index"
        v-bind="option"
      />
      <template v-if="activeOption && hasIcon" #label>
        <cl-icon :icon="activeOption?.icon" />
        <span>{{ activeOption?.label }}</span>
      </template>
    </el-select>
  </div>
</template>

<style scoped>
.filter-select {
  display: flex;
  align-items: center;
  flex: 1 0 auto;

  &:deep(.icon) {
    width: 14px;
    margin-right: 5px;
  }

  .content {
    flex: 1 0 180px;
    width: 180px;
  }
}
</style>
