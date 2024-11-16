<script setup lang="ts">
const imageForm = defineModel<ImageForm>({ required: true });

defineProps<{
  visible?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
defineOptions({ name: 'ClInsertImageDialog' });
</script>

<template>
  <cl-dialog :visible="visible" @confirm="emit('confirm')">
    <cl-form>
      <cl-form-item :span="4" label="Image URL">
        <el-input v-model="imageForm.src" />
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
