<script setup lang="ts">
import { watch } from 'vue';
import { useStore } from 'vuex';
import { TAB_NAME_TEMPLATE } from '@/constants';
import useNotificationSettingDetail from '@/views/notification/setting/detail/useNotificationSettingDetail';

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

watch<NotificationSetting>(
  () => state.form,
  (currentForm, previousForm) => {
    if (currentForm._id !== previousForm._id) {
      // compatibility with legacy template
      if (
        (currentForm.template_mode === 'markdown' ||
          !currentForm.template_mode) &&
        currentForm.template &&
        !currentForm.template_markdown
      ) {
        store.commit(`${ns}/setForm`, {
          ...state.form,
          template_mode: 'markdown',
          template_markdown: state.form.template,
          template: undefined,
        } as NotificationSetting);
      }
      return;
    }
  }
);

defineOptions({ name: 'ClNotificationSettingDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="notificationSetting">
    <template #actions>
      <cl-notification-setting-detail-actions-common />
      <!--      <cl-notification-setting-detail-actions-template-->
      <!--        v-if="activeTabName === TAB_NAME_TEMPLATE"-->
      <!--      />-->
    </template>
  </cl-detail-layout>
</template>

<style scoped></style>
