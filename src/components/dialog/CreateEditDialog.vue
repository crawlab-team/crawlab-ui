<script setup lang="ts">
defineOptions({ name: 'ClCreateEditDialog' });
import { computed, provide } from 'vue';
import { sendEvent } from '@/admin/umeng';
import { emptyArrayFunc, translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    type: CreateEditDialogType;
    width: string;
    confirmDisabled: boolean;
    confirmLoading: boolean;
    actionFunctions?: CreateEditDialogActionFunctions;
    title?: string;
    formRules: FormRuleItem[];
  }>(),
  {
    visible: false,
    type: 'create',
    width: '80vw',
    confirmDisabled: false,
    confirmLoading: false,
    formRules: emptyArrayFunc,
  }
);

// i18n
const t = translate;

const computedTitle = computed<string>(() => {
  const { visible, type, title } = props;
  if (title) return title;
  if (!visible) return '';
  switch (type) {
    case 'create':
      return t('components.dialog.create');
    case 'edit':
      return t('components.dialog.edit');
    default:
      return t('components.dialog.dialog');
  }
});

const onClose = () => {
  const { actionFunctions } = props;
  actionFunctions?.onClose?.();

  sendEvent('click_create_edit_dialog_close');
};

const onConfirm = () => {
  const { actionFunctions } = props;
  actionFunctions?.onConfirm?.();
};

provide<CreateEditDialogActionFunctions | undefined>(
  'action-functions',
  props.actionFunctions
);
provide<FormRuleItem[] | undefined>('form-rules', props.formRules);
</script>

<template>
  <cl-dialog
    class-name="create-edit-dialog"
    :title="computedTitle"
    :visible="visible"
    :width="width"
    :confirm-loading="confirmLoading"
    :confirm-disabled="confirmDisabled"
    @close="onClose"
    @confirm="onConfirm"
  >
    <slot />
  </cl-dialog>
</template>

<style lang="scss">
.create-edit-dialog-tabs {
  &.edit,
  &:not(.visible) {
    .el-tabs__header {
      display: none;
    }
  }
}
</style>
