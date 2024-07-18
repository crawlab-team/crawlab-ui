<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import useNotificationSetting from '@/components/core/notification/setting/useNotificationSetting';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const { t } = useI18n();

// store
const store = useStore();

const { form, formRef, isSelectiveForm } = useNotificationSetting(store);
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
  </cl-form>
</template>

<style scoped></style>
