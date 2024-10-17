<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { alertTemplates, allTemplates, translate } from '@/utils';
import useNotificationSetting from '@/components/core/notification/setting/useNotificationSetting';
import { ClNotificationAlertForm } from '@/components';
import { ElMessage } from 'element-plus';

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

const onTemplateChange = () => {
  const { template_key } = form.value;
  const template = allTemplates.find(t => t.key === template_key);
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

  // handle alert template
  if (template.key.startsWith('alert')) {
    onCreateAlertClick();
  }
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
  // find existing alert
  let alertForm = notificationAlertState.allList.find(
    a => a.name === form.value.name
  ) as NotificationAlert;

  // create new alert if not found
  if (!alertForm) {
    if (form.value.template_key) {
      // find alert template
      alertForm = alertTemplates.find(
        t => t.key === form.value.template_key
      ) as NotificationAlert;

      // handle alert template
      if (alertForm) {
        alertForm = {
          ...alertForm,
          name: t(alertForm.name as string),
          description: t(alertForm.description as string),
          enabled: true,
          template_key: form.value.template_key,
        };
      }
    }

    // create new alert form if template not found
    if (!alertForm) alertForm = notificationAlertState.newFormFn();

    // set alert form
    store.commit('notificationAlert/setForm', { ...alertForm });

    // open alert form create dialog
    createAlertVisible.value = true;
  } else {
    // set alert id if alert form exists
    store.commit(`${ns}/setForm`, {
      ...form.value,
      alert_id: alertForm._id,
    });
  }
};
const onCreateAlertConfirm = async () => {
  // validate alert form
  await alertFormRef.value?.validateForm();

  // create alert
  const { data: newAlert } = await store.dispatch(
    'notificationAlert/create',
    notificationAlertState.form
  );
  ElMessage.success(t('views.notification.message.success.create.alert'));

  // set alert all list
  store.commit('notificationAlert/setAllList', [
    ...notificationAlertState.allList,
    newAlert,
  ]);

  // set alert id
  store.commit(`${ns}/setForm`, {
    ...form.value,
    alert_id: newAlert._id,
  });

  // close alert form create dialog
  createAlertVisible.value = false;
};

const formDisabled = computed<boolean>(() => {
  if (activeDialogKey.value !== 'create') {
    return false;
  }
  return !form.value.use_custom_setting;
});

const formRequired = computed<boolean>(() => {
  if (activeDialogKey.value !== 'create') {
    return true;
  }
  return !!form.value.use_custom_setting;
});

defineOptions({ name: 'ClNotificationSettingForm' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form" :selective="isSelectiveForm">
    <template v-if="activeDialogKey === 'create'">
      <cl-form-item
        :span="2"
        :label="t('views.notification.settings.templates.label')"
        prop="template_key"
        :required="!form.use_custom_setting"
      >
        <el-select
          v-model="form.template_key"
          @change="onTemplateChange"
          clearable
        >
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
      <cl-form-item :span="2" no-label>
        <el-checkbox v-model="form.use_custom_setting">
          {{ t('views.notification.settings.form.useCustomSetting.label') }}
        </el-checkbox>
        <cl-tip
          :tooltip="
            t('views.notification.settings.form.useCustomSetting.tooltip')
          "
        />
      </cl-form-item>
    </template>

    <cl-form-item
      :span="2"
      :label="t('views.notification.settings.form.name')"
      prop="name"
      :required="formRequired"
    >
      <el-input
        v-model="form.name"
        :placeholder="t('views.notification.settings.form.name')"
        :disabled="formDisabled"
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
        :disabled="formDisabled"
      />
    </cl-form-item>

    <cl-form-item
      v-if="activeDialogKey === 'create'"
      :span="2"
      :offset="form.trigger === 'alert' ? 0 : 2"
      :label="t('views.notification.settings.form.trigger')"
      prop="trigger"
      :required="formRequired"
    >
      <cl-notification-setting-trigger-select
        v-model="form.trigger"
        :disabled="formDisabled"
      />
    </cl-form-item>
    <cl-form-item
      v-if="form.trigger === 'alert'"
      :span="2"
      :label="t('views.notification.settings.form.alert')"
      prop="alert_id"
      required
    >
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
.alert-wrapper,
.alert-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
