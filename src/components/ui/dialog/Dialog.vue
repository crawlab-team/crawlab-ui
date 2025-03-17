<script setup lang="ts">
import { translate } from '@/utils';

withDefaults(
  defineProps<{
    visible: boolean;
    modalClass?: string;
    title?: string;
    titleIcon?: Icon;
    top?: string;
    width?: string;
    zIndex?: number;
    confirmDisabled?: boolean;
    confirmLoading?: boolean;
    confirmType?: BasicType;
    confirmText?: string;
    className?: string;
    appendToBody?: boolean;
  }>(),
  {
    top: '15vh',
    confirmType: 'primary',
    appendToBody: true,
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
defineOptions({ name: 'ClDialog' });
</script>

<template>
  <el-dialog
    :custom-class="
      ['cl-dialog', className, visible ? 'visible' : 'hidden'].join(' ')
    "
    :append-to-body="appendToBody"
    :modal-class="modalClass"
    :before-close="onClose"
    :model-value="visible"
    :title="title"
    :top="top"
    :width="width"
    :z-index="zIndex"
  >
    <slot />
    <template #header>
      <slot v-if="$slots.title" name="title" />
      <div v-else-if="titleIcon">
        <cl-icon :icon="titleIcon" />
        <span class="title">{{ title }}</span>
      </div>
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
        {{ confirmText || t('common.actions.confirm') }}
      </cl-button>
      <slot name="suffix" />
    </template>
  </el-dialog>
</template>

<style scoped>
.el-dialog {
  .title {
    margin-left: 10px;
  }
}
</style>
