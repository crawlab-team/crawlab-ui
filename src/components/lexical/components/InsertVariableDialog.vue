<script setup lang="ts">
import { ref, watch } from 'vue';
import ClForm from '@/components/form/Form.vue';

const variableForm = defineModel<VariableForm>({ required: true });

const props = defineProps<{
  visible?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const options: SelectOption[] = [
  { value: 'variable1', label: 'Variable 1' },
  { value: 'variable2', label: 'Variable 2' },
  { value: 'variable3', label: 'Variable 3' },
  { value: 'variable4', label: 'Variable 4' },
  { value: 'variable5', label: 'Variable 5' },
];

const formRef = ref<typeof ClForm>();

const onConfirm = async () => {
  await formRef.value?.validate();
  emit('confirm');
};

watch(
  () => props.visible,
  () => {
    if (!formRef.value) return;
    if (props.visible) {
      formRef.value.resetFields();
      formRef.value.clearValidate();
    }
  }
);

defineOptions({ name: 'ClInsertVariableDialog' });
</script>

<template>
  <cl-dialog :visible="visible" @close="emit('close')" @confirm="onConfirm">
    <cl-form ref="formRef" :model="variableForm">
      <cl-form-item prop="name" :span="4" label="Variable URL" required>
        <el-select v-model="variableForm.name">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>

<style scoped lang="scss"></style>
