<script setup lang="ts">
import { useStore } from 'vuex';
import { translate } from '@/utils';

const t = translate;

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

defineOptions({ name: 'ClNotificationSettingDetailTabMailConfigs' });
</script>

<template>
  <div class="notification-setting-detail-tab-mail-config">
    <cl-form :model="state.form">
      <cl-form-item
        :span="2"
        :label="t('views.notification.settings.form.senderEmail')"
        prop="sender_email"
        required
      >
        <el-input
          v-model="state.form.sender_email"
          :placeholder="t('views.notification.settings.form.senderEmail')"
        />
      </cl-form-item>
      <cl-form-item
        :span="2"
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
        <el-input
          v-model="state.form.mail_to"
          :placeholder="t('views.notification.settings.form.mailTo')"
        />
      </cl-form-item>

      <cl-form-item
        :span="4"
        :label="t('views.notification.settings.form.mailCc')"
        prop="mail_cc"
      >
        <el-input
          v-model="state.form.mail_cc"
          :placeholder="t('views.notification.settings.form.mailCc')"
        />
      </cl-form-item>

      <cl-form-item
        :span="4"
        :label="t('views.notification.settings.form.mailBcc')"
        prop="mail_bcc"
      >
        <el-input
          v-model="state.form.mail_bcc"
          :placeholder="t('views.notification.settings.form.mailBcc')"
        />
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style lang="scss" scoped>
.notification-setting-detail-tab-mail-config {
  margin: 20px;
}
</style>
