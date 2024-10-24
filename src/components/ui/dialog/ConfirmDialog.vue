<script setup lang="ts">
import { ref } from 'vue';
import { voidAsyncFunc } from '@/utils/func';

const props = withDefaults(
  defineProps<{
    confirmFunc: () => Promise<void>;
    title: string;
    content?: string;
  }>(),
  {
    confirmFunc: voidAsyncFunc,
  }
);

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const visible = ref<boolean>(false);

const confirmLoading = ref<boolean>(false);

const onCancel = () => {
  visible.value = false;
  emit('cancel');
};

const onConfirm = async () => {
  const { confirmFunc } = props;
  confirmLoading.value = true;
  await confirmFunc();
  confirmLoading.value = false;
  visible.value = false;
  emit('confirm');
};
defineOptions({ name: 'ClConfirmDialog' });
</script>

<template>
  <cl-dialog
    :confirm-loading="confirmLoading"
    :title="title"
    :visible="visible"
    @close="onCancel"
    @confirm="onConfirm"
  >
    <template v-if="content">
      {{ content }}
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </cl-dialog>
</template>


