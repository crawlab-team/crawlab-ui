<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { translate } from '@/utils';
import useTask from '@/components/core/task/useTask';

const t = translate;

// store
const ns = 'task';
const store = useStore();

const { form, createEditDialogVisible } = useTask(store);

const visible = computed(() => createEditDialogVisible.value);

const formRef = ref();

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
  store.commit(`${ns}/resetForm`);
};

const onConfirm = async () => {
  await formRef.value?.validate();
  await store.dispatch(`${ns}/create`, form.value);
  store.commit(`${ns}/hideDialog`);
  ElMessage.success(t('common.message.success.create'));
  await store.dispatch(`${ns}/getList`);
};

defineOptions({ name: 'ClCreateTaskDialog' });
</script>

<template>
  <cl-dialog
    :title="t('components.task.dialog.create.title')"
    :visible="visible"
    class-name="run-spider-dialog"
    width="1024px"
    @close="onClose"
    @confirm="onConfirm"
  >
    <template #default>
      <cl-task-form ref="formRef" />
    </template>
  </cl-dialog>
</template>
