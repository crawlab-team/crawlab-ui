<script setup lang="ts">
import { useStore } from 'vuex';
import { translate } from '@/utils';
import { InternalRuleItem } from 'async-validator';

const t = translate;

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

const emailValidator = (
  _: InternalRuleItem,
  value: string[],
  callback: (error?: string | Error) => void
) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  for (const v of value) {
    // email
    if (!regex.test(v)) {
      callback(
        new Error(t('views.notification.settings.formRules.invalidEmail'))
      );
      return;
    }
  }
  callback();
};

const rules: FormRules = {
  mail_to: [{ validator: emailValidator }],
  mail_cc: [{ validator: emailValidator }],
  mail_bcc: [{ validator: emailValidator }],
};

defineOptions({ name: 'ClNotificationSettingDetailTabMailConfig' });
</script>

<template>
  <div class="notification-setting-detail-tab-mail-config">
    <cl-form :model="state.form" :rules="rules">
      <cl-form-item
        :span="4"
        :label="t('views.notification.settings.form.senderEmail')"
        prop="sender_email"
        :required="state.form.use_custom_sender_email"
      >
        <el-input
          v-model="state.form.sender_email"
          :placeholder="t('views.notification.settings.form.senderEmail')"
          :disabled="!state.form.use_custom_sender_email"
        />
        <el-checkbox v-model="state.form.use_custom_sender_email">
          {{ t('views.notification.settings.form.useCustomSenderEmail.label') }}
        </el-checkbox>
        <cl-tip
          :tooltip="
            t('views.notification.settings.form.useCustomSenderEmail.tooltip')
          "
        />
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('views.notification.settings.form.senderName')"
        prop="sender_name"
      >
        <el-input
          v-model="state.form.sender_name"
          :placeholder="t('views.notification.settings.form.senderName')"
        />
      </cl-form-item>

      <cl-form-item
        :span="4"
        :label="t('views.notification.settings.form.mailTo')"
        prop="mail_to"
        required
      >
        <cl-input-select
          v-model="state.form.mail_to"
          :placeholder="t('views.notification.settings.form.mailTo')"
        />
      </cl-form-item>

      <cl-form-item
        :span="4"
        :label="t('views.notification.settings.form.mailCc')"
        prop="mail_cc"
      >
        <cl-input-select
          v-model="state.form.mail_cc"
          :placeholder="t('views.notification.settings.form.mailCc')"
        />
      </cl-form-item>

      <cl-form-item
        :span="4"
        :label="t('views.notification.settings.form.mailBcc')"
        prop="mail_bcc"
      >
        <cl-input-select
          v-model="state.form.mail_bcc"
          :placeholder="t('views.notification.settings.form.mailBcc')"
        />
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style scoped>
.notification-setting-detail-tab-mail-config {
  margin: 20px;

  .sender-email-wrapper {
    display: flex;
    gap: 10px;

    .use-custom-sender-email-wrapper {
      display: flex;
      gap: 5px;
    }
  }
}
</style>
