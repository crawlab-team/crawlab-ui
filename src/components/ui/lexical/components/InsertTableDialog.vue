<script setup lang="ts">
const tableForm = defineModel<TableForm>({ required: true });

defineProps<{
  visible?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
defineOptions({ name: 'ClInsertTableDialog' });
</script>

<template>
  <cl-dialog :visible="visible" @confirm="emit('confirm')">
    <cl-form>
      <cl-form-item :span="4" label="Rows">
        <el-input-number v-model="tableForm.rows" />
      </cl-form-item>
      <cl-form-item :span="4" label="Columns">
        <el-input-number v-model="tableForm.columns" />
      </cl-form-item>
      <cl-form-item :span="4" label="Include Headers">
        <cl-switch v-model="tableForm.includeHeaders" />
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
