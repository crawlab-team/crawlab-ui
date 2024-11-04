<script setup lang="ts">
import { ref } from 'vue';
import { debounce } from '@/utils';

defineProps<{
  id?: string;
  label?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'change', value: any): void;
  (e: 'enter', value: any): void;
  (e: 'clear'): void;
}>();

const internalModelValue = ref();

const onChange = debounce((value: any) => {
  emit('change', value);
}, 500);

const onClear = () => {
  internalModelValue.value = undefined;
  emit('change', undefined);
  emit('clear');
};

const onEnter = () => {
  emit('enter', internalModelValue.value);
};

defineOptions({ name: 'ClFilterInput' });
</script>

<template>
  <div class="filter-input" :id="id">
    <label v-if="label" class="label">
      {{ label }}
    </label>
    <el-input
      v-model="internalModelValue"
      :placeholder="placeholder"
      clearable
      @clear="onClear"
      @input="onChange"
      @keyup.enter="onEnter"
    />
  </div>
</template>
