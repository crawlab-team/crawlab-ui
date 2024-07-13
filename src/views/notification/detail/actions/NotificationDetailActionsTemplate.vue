<script setup lang="tsx">
import { ref, watch } from 'vue';
import { translate } from '@/utils';
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';

const t = translate;

const ns = 'notification';
const store = useStore();
const { notification: state } = store.state as RootStoreState;

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
watch(
  () => state.form.template_mode,
  mode => {
    templateMode.value = mode || 'markdown';
    if (!state.form.template_mode) {
      store.commit(`${ns}/setForm`, {
        ...state.form,
        template_mode: templateMode.value,
      });
    }
  }
);

const onTemplateModeClick = async (event: MouseEvent) => {
  event.preventDefault();
  const itemElement = (event.target as HTMLElement).closest<HTMLElement>(
    '.el-segmented__item'
  );
  if (!itemElement) return;
  if (
    new Set(itemElement.classList).intersection(
      new Set(['is-selected', 'is-disabled'])
    ).size > 0
  )
    return;
  await ElMessageBox.confirm(
    <div>
      <p>Are you sure to continue?</p>
      <p>
        <strong>NOTE: Some styles might be lost.</strong>
      </p>
    </div>,
    'Change Mode',
    {
      type: 'warning',
    }
  );
  const dataValueElement =
    itemElement.querySelector<HTMLElement>('.data-value');
  if (!dataValueElement) return;
  templateMode.value = dataValueElement.getAttribute(
    'data-value'
  ) as NotificationTemplateMode;
  store.commit(`${ns}/setForm`, {
    ...state.form,
    template_mode: templateMode.value,
  });
};

defineOptions({ name: 'ClNotificationDetailActionsTemplate' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'file-code']" />
    <cl-nav-action-item>
      <el-segmented
        v-model="templateMode"
        :options="templateModeOptions"
        @click="onTemplateModeClick"
      >
        <template #default="{ item }">
          <cl-icon :icon="item.icon" />
          <span>{{ item.label }}</span>
          <div class="data-value hidden" :data-value="item.value" />
        </template>
      </el-segmented>
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
