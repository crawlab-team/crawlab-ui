<script setup lang="ts">
import { useStore } from 'vuex';
import useNotificationSetting from '@/components/core/notification/setting/useNotificationSetting';
import { allTemplates, translate } from '@/utils';
import { ref } from 'vue';
import ClNotificationSettingTriggerSelect from '@/components/core/notification/setting/NotificationSettingTriggerSelect.vue';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const t = translate;

// store
const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();

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

    <template v-if="activeDialogKey === 'create'">
      <cl-form-item
        :span="2"
        :offset="2"
        :label="t('views.notification.settings.form.trigger')"
      >
        <cl-notification-setting-trigger-select v-model="form.trigger" />
      </cl-form-item>

      <cl-form-item
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
    </template>
  </cl-form>
</template>
