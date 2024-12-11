<script setup lang="ts">
import { useStore } from 'vuex';
import { useNotificationRequestList } from '@/views';
import { translate } from '@/utils';
import ClNotificationRequestStatus from '@/components/core/notification/request/NotificationRequestStatus.vue';
import { computed } from 'vue';

const t = translate;

const ns: ListStoreNamespace = 'notificationRequest';
const store = useStore();
const { notificationRequest: state } = store.state as RootStoreState;

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
} = useNotificationRequestList();

const hasMail = computed<boolean>(() => {
  return state.form?.channel?.type === 'mail';
});

defineOptions({ name: 'ClNotificationRequestList' });
</script>

<template>
  <cl-list-layout
    class="notification-request-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
  />

  <el-drawer
    :model-value="!!state.form?._id"
    @close="store.commit(`${ns}/resetForm`)"
  >
    <template #header>
      <div style="width: 100%; text-align: left">
        <h4>
          {{ t('views.notification.requests.detail.title') }}
        </h4>
      </div>
    </template>
    <el-descriptions :column="1" border>
      <el-descriptions-item>
        <template #label>
          <cl-icon :icon="['fa', 'cog']" />
          {{ t('views.notification.requests.form.setting') }}
        </template>
        <cl-tag
          v-if="state.form?.test"
          :icon="['fa', 'bell']"
          :label="t('components.notification.request.test.label')"
          :tooltip="t('components.notification.request.test.tooltip')"
          type="warning"
        />
        <cl-nav-link
          v-else
          :path="`/notifications/settings/${state.form?.setting?._id}`"
          :label="state.form?.setting?.name"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <cl-icon :icon="['fa', 'broadcast-tower']" />
          {{ t('views.notification.requests.form.channel') }}
        </template>
        <cl-nav-link
          :path="`/notifications/channels/${state.form?.channel?._id}`"
          :label="state.form?.channel?.name"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <cl-icon :icon="['fa', 'check-square']" />
          {{ t('views.notification.requests.form.status') }}
        </template>
        <cl-notification-request-status
          :status="state.form?.status || 'unknown'"
          :error="state.form?.error"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <cl-icon :icon="['fa', 'clock']" />
          {{ t('views.notification.requests.form.createdAt') }}
        </template>
        <cl-time :time="state.form?.created_ts" />
      </el-descriptions-item>
      <template v-if="hasMail">
        <el-descriptions-item>
          <template #label>
            <cl-icon :icon="['fa', 'at']" />
            {{ t('views.notification.requests.form.senderEmail') }}
          </template>
          <span>{{ state.form?.sender_email }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <cl-icon :icon="['fa', 'font']" />
            {{ t('views.notification.requests.form.senderName') }}
          </template>
          <span>{{ state.form?.sender_name }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <cl-icon :icon="['fa', 'at']" />
            {{ t('views.notification.requests.form.mailTo') }}
          </template>
          <template v-if="state.form?.mail_to">
            <cl-tag
              v-for="mail in state.form.mail_to"
              :key="mail"
              :label="mail"
              type="primary"
            />
          </template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <cl-icon :icon="['fa', 'at']" />
            {{ t('views.notification.requests.form.mailCc') }}
          </template>
          <template v-if="state.form?.mail_cc">
            <cl-tag
              v-for="mail in state.form.mail_cc"
              :key="mail"
              :label="mail"
              type="primary"
            />
          </template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <cl-icon :icon="['fa', 'at']" />
            {{ t('views.notification.requests.form.mailBcc') }}
          </template>
          <template v-if="state.form?.mail_bcc">
            <cl-tag
              v-for="mail in state.form.mail_bcc"
              :key="mail"
              :label="mail"
              type="primary"
            />
          </template>
        </el-descriptions-item>
      </template>
    </el-descriptions>

    <div class="notification-request-content">
      <el-divider>
        {{ t('views.notification.requests.form.title') }}
      </el-divider>
      <h4>{{ state.form?.title }}</h4>
      <el-divider>
        {{ t('views.notification.requests.form.content') }}
      </el-divider>
      <pre>{{ state.form?.content }}</pre>
    </div>
  </el-drawer>
</template>

<style scoped>
.notification-request-content {
  width: 100%;
  padding: 20px;
  text-align: left;

  pre {
    width: 100%;
    overflow: auto;
    font-size: 14px;
  }
}
</style>
