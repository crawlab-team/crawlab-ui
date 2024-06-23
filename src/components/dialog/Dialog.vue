<script setup lang="ts">
defineOptions({ name: 'ClDialog' });
import { translate } from '@/utils';

withDefaults(
  defineProps<{
    visible: boolean;
    modalClass?: string;
    title?: string;
    top?: string;
    width?: string;
    zIndex?: number;
    confirmDisabled?: boolean;
    confirmLoading?: boolean;
    confirmType?: BasicType;
    className?: string;
  }>(),
  {
    top: '15vh',
    confirmType: 'primary',
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

// i18n
const t = translate;

const onClose = () => {
  emit('close');
};

const onConfirm = () => {
  emit('confirm');
};
</script>

<template>
  <el-dialog
    :custom-class="[className, visible ? 'visible' : 'hidden'].join(' ')"
    :modal-class="modalClass"
    :before-close="onClose"
    :model-value="visible"
    :top="top"
    :width="width"
    :z-index="zIndex"
  >
    <slot />
    <template #title>
      <div v-html="title" />
    </template>
    <template #footer>
      <slot name="prefix" />
      <cl-button
        id="cancel-btn"
        class-name="cancel-btn"
        plain
        type="info"
        @click="onClose"
      >
        {{ t('common.actions.cancel') }}
      </cl-button>
      <cl-button
        id="confirm-btn"
        class-name="confirm-btn"
        :disabled="confirmDisabled"
        :loading="confirmLoading"
        :type="confirmType"
        @click="onConfirm"
      >
        {{ t('common.actions.confirm') }}
      </cl-button>
      <slot name="suffix" />
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
