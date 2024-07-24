<script setup lang="tsx">
import { onBeforeMount, ref, watch } from 'vue';
import { translate, UPDATE_MARKDOWN_EVENT } from '@/utils';
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';
import { publish } from '@/utils/eventBus';

const t = translate;

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

const templateMode = ref<NotificationTemplateMode | undefined>(
  state.form.template_mode
);
const templateModeOptions: SelectOption<NotificationTemplateMode>[] = [
  {
    label: t('components.notification.template.modes.markdown'),
    value: 'markdown',
    icon: ['fa', 'file-alt'],
  },
  {
    label: t('components.notification.template.modes.richText'),
    value: 'rich-text',
    icon: ['fa', 'file-word'],
    // disabled: true,
  },
];
const updateTemplateMode = () => {
  templateMode.value = state.form.template_mode || 'markdown';
  if (!state.form.template_mode) {
    store.commit(`${ns}/setForm`, {
      ...state.form,
      template_mode: templateMode.value,
    });
  }
};
watch(() => state.form.template_mode, updateTemplateMode);
onBeforeMount(updateTemplateMode);

const onTemplateModeClick = async (
  event: MouseEvent,
  option: SelectOption<NotificationTemplateMode>
) => {
  event.preventDefault();
  if (option.value === templateMode.value || option.disabled) return;
  await ElMessageBox.confirm(
    <div>
      <p>{t('common.messageBox.confirm.continue')}</p>
      <p>
        <strong>
          {t('components.notification.template.mode.change.note')}
        </strong>
      </p>
    </div>,
    t('components.notification.template.mode.change.label'),
    {
      type: 'warning',
    }
  );
  templateMode.value = option.value;
  store.commit(`${ns}/setForm`, {
    ...state.form,
    template_mode: templateMode.value,
  });
  if (templateMode.value === 'markdown') {
    publish(UPDATE_MARKDOWN_EVENT);
  }
};

defineOptions({ name: 'ClNotificationSettingDetailActionsTemplate' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'file-code']" />
    <cl-nav-action-item>
      <el-radio-group :model-value="templateMode">
        <el-radio-button
          v-for="op in templateModeOptions"
          :key="op.value"
          :value="op.value"
          :disabled="op.disabled"
          @click="(event: MouseEvent) => onTemplateModeClick(event, op)"
        >
          <cl-icon :icon="op.icon" />
          <span>{{ op.label }}</span>
        </el-radio-button>
      </el-radio-group>
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped>
.nav-action-group {
  &:deep(.el-segmented) {
    margin: 0;
  }

  &:deep(.icon) {
    margin-right: 5px;
  }
}
</style>
