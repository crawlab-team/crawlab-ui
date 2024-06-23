<script setup lang="ts">
defineOptions({ name: 'ClCheckTagGroup' });
import { computed, onBeforeMount, reactive, watch } from 'vue';

export interface CheckTagGroupProps {
  modelValue: string[];
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

const props = defineProps<CheckTagGroupProps>();

const emit = defineEmits<{
  (e: 'update:model-value', value: string[]): void;
  (e: 'change', value: string[]): void;
}>();

const checkedMap = reactive<{ [key: string]: boolean }>({});

const checkedKeys = computed<string[]>(() => {
  return Object.keys(checkedMap).filter(k => checkedMap[k]);
});

const onChange = () => {
  emit('update:model-value', checkedKeys.value);
  emit('change', checkedKeys.value);
};

const updateCheckedMap = () => {
  if (props.modelValue) {
    props.modelValue.forEach(key => {
      checkedMap[key] = true;
    });
  }
};

onBeforeMount(updateCheckedMap);
watch(() => props.modelValue, updateCheckedMap);
</script>

<template>
  <div class="check-tag-group">
    <cl-check-tag
      v-for="op in options"
      :key="{ v: op.value, c: checkedMap[op.value] }"
      v-model="checkedMap[op.value]"
      :disabled="disabled"
      :label="op.label"
      clickable
      :class-name="className"
      style="margin-right: 10px"
      @change="onChange"
    />
  </div>
</template>

<style scoped>
.check-tag-group:deep(.el-tag:not(:last-child)) {
  margin-right: 10px;
}
</style>
