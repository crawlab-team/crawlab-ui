<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import useNotificationChannel from '@/components/core/notification/channel/useNotificationChannel';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const { t } = useI18n();

// store
const store = useStore();

const { form, formRef, isSelectiveForm } = useNotificationChannel(store);
defineOptions({ name: 'ClNotificationChannelForm' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form" :selective="isSelectiveForm">
    <cl-form-item
      :span="2"
      :label="t('views.notification.channels.form.name')"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :placeholder="t('views.notification.channels.form.name')"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('views.notification.channels.form.enabled')"
      prop="enabled"
    >
      <cl-switch v-model="form.enabled" />
    </cl-form-item>
    <cl-form-item
      :span="4"
      :label="t('views.notification.channels.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        type="textarea"
        :placeholder="t('views.notification.channels.form.description')"
      />
    </cl-form-item>
  </cl-form>
</template>

<style scoped></style>
