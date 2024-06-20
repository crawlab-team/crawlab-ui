<script setup lang="ts">
defineOptions({ name: 'ClForm' });
import { computed, provide, reactive, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    model?: FormModel;
    inline?: boolean;
    labelWidth?: string;
    size?: string;
    grid?: number;
    rules?: FormRules;
  }>(),
  {
    inline: true,
    labelWidth: '150px',
    size: 'default',
    grid: 4,
  }
);

const emit = defineEmits<{
  (e: 'validate'): void;
}>();

const form = computed<FormContext>(() => {
  const { labelWidth, size, grid } = props;
  return { labelWidth, size, grid };
});

provide('form-context', reactive<FormContext>(form.value));

const formRef = ref();

const validate = async () => {
  return await formRef.value?.validate();
};

const resetFields = () => {
  return formRef.value?.resetFields();
};

const clearValidate = () => {
  return formRef.value?.clearValidate();
};

defineExpose({
  validate,
  resetFields,
  clearValidate,
});
</script>

<template>
  <el-form
    ref="formRef"
    :inline="inline"
    :label-width="labelWidth"
    :size="size"
    :model="model"
    class="form"
    :rules="rules"
    hide-required-asterisk
    @validate="$emit('validate')"
  >
    <slot></slot>
  </el-form>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-wrap: wrap;
}
</style>
