<script setup lang="ts">
import { ref, watch } from 'vue';
import { translate } from '@/utils';
import { useStore } from 'vuex';

const t = translate;

const ns = 'notification';
const store = useStore();
const { notification: state } = store.state as RootStoreState;

const templateMode = ref<NotificationTemplateMode>(
  state.form.template_mode || 'markdown'
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

const onTemplateModeChange = (mode: NotificationTemplateMode) => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    template_mode: mode,
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
        @change="onTemplateModeChange"
      >
        <template #default="{ item }">
          <cl-icon :icon="item.icon" />
          <span style="margin-left: 5px">{{ item.label }}</span>
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
}
</style>
