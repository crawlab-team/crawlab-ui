<script setup lang="ts">
import { ref } from 'vue';
import { ElSelect } from 'element-plus';
import { translate } from '@/utils';

const modelValue = defineModel<string[]>({
  default: [],
});

const props = defineProps<{
  options?: SelectOption[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'change', value: string[]): void;
}>();

const t = translate;

const selectRef = ref<typeof ElSelect>();

const inputValue = ref('');

const onChange = () => {
  emit('change', modelValue.value);
  inputValue.value = '';
};

defineOptions({ name: 'ClInputSelect' });
</script>

<template>
  <el-select
    ref="selectRef"
    v-model="modelValue"
    multiple
    filterable
    allow-create
    :reserve-keyword="false"
    default-first-option
    :placeholder="placeholder"
    :no-data-text="t('common.select.input.noDataText')"
    @input="
      (event: InputEvent) =>
        (inputValue = (event.target as HTMLInputElement).value)
    "
    @keyup.enter="onChange"
    @change="onChange"
  >
    <el-option
      v-for="op in props.options"
      :key="op.value"
      :value="op.value"
      :label="op.label"
    />
  </el-select>
</template>
