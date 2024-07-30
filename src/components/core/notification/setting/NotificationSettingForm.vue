<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { allTemplates, translate } from '@/utils';
import useNotificationSetting from '@/components/core/notification/setting/useNotificationSetting';
import { ClNotificationAlertForm } from '@/components';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const t = translate;

// store
const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationAlert: notificationAlertState } =
  store.state as RootStoreState;

const { form, formRef, isSelectiveForm, activeDialogKey } =
  useNotificationSetting(store);

const templateKey = ref();
const onTemplateChange = () => {
  const template = allTemplates.find(t => t.key === templateKey.value);
  if (!template) return;
  const { name, description, title, template_markdown, template_rich_text } =
    template;
  store.commit(`${ns}/setForm`, {
    ...form.value,
    ...template,
    name: t(name as string),
    description: t(description as string),
    title: t(title as string),
    template_markdown: template_markdown && t(template_markdown as string),
    template_rich_text: template_rich_text && t(template_rich_text as string),
  });
};

const alertSelectOptions = computed<SelectOption<string>[]>(() =>
  notificationAlertState.allList.map((item: NotificationAlert) => ({
    label: item.name,
    value: item._id,
  }))
);

const createAlertVisible = ref(false);
const alertFormRef = ref<typeof ClNotificationAlertForm>();
const onCreateAlertClick = () => {
  store.commit('notificationAlert/setForm', notificationAlertState.newFormFn());
  createAlertVisible.value = true;
};
const onCreateAlertConfirm = async () => {
  // TODO: implement association with alert
  await alertFormRef.value?.validateForm();
};

defineOptions({ name: 'ClNotificationSettingForm' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form" :selective="isSelectiveForm">
    <cl-form-item
      :span="2"
      :label="t('views.notification.settings.form.name')"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :placeholder="t('views.notification.settings.form.name')"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('views.notification.settings.form.enabled')"
      prop="enabled"
    >
      <cl-switch v-model="form.enabled" />
    </cl-form-item>

    <cl-form-item
      :span="4"
      :label="t('views.notification.settings.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        type="textarea"
        :placeholder="t('views.notification.settings.form.description')"
      />
    </cl-form-item>

    <cl-form-item
      v-if="activeDialogKey === 'create'"
      :span="2"
      :offset="form.trigger === 'alert' ? 0 : 2"
      :label="t('views.notification.settings.form.trigger')"
      prop="trigger"
      required
    >
      <cl-notification-setting-trigger-select v-model="form.trigger" />
    </cl-form-item>
    <cl-form-item
      v-if="form.trigger === 'alert'"
      :span="2"
      :label="t('views.notification.settings.form.alert')"
      prop="alert_id"
      required
    >
      <div class="alert-wrapper">
        <el-select v-model="form.alert_id">
          <el-option
            v-for="op in alertSelectOptions"
            :key="op.value"
            :value="op.value"
            :label="op.label"
          />
        </el-select>
        <cl-fa-icon-button
          :icon="['fa', 'plus']"
          :tooltip="t('views.notification.settings.actions.createAlert')"
          @click="onCreateAlertClick"
        />
      </div>
    </cl-form-item>
    <cl-form-item
      v-if="activeDialogKey === 'create'"
      :span="2"
      :offset="2"
      :label="t('views.notification.settings.templates.label')"
    >
      <el-select v-model="templateKey" @change="onTemplateChange" clearable>
        <el-option
          v-for="op in allTemplates"
          :key="op.key"
          :value="op.key"
          :label="
            t(`components.notification.setting.templates.${op.key}.label`)
          "
        />
      </el-select>
    </cl-form-item>
  </cl-form>

  <el-drawer
    v-model="createAlertVisible"
    :title="t('views.notification.settings.actions.createAlert')"
    size="960px"
  >
    <cl-notification-alert-form ref="alertFormRef" />
    <template #footer>
      <el-button plain @click="createAlertVisible = false">
        {{ t('common.actions.cancel') }}
      </el-button>
      <el-button type="primary" @click="onCreateAlertConfirm">
        {{ t('common.actions.confirm') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.alert-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
