<script setup lang="ts">
import { watch } from 'vue';
import { useStore } from 'vuex';
import { TAB_NAME_TEMPLATE } from '@/constants';
import useNotificationDetail from '@/views/notification/detail/useNotificationDetail';

const ns = 'notification';
const store = useStore();
const { notification: state } = store.state as RootStoreState;
const { activeTabName } = useNotificationDetail();

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

defineOptions({ name: 'ClNotificationDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="notification">
    <template #actions>
      <cl-notification-detail-actions-common />
      <cl-notification-detail-actions-template
        v-if="activeTabName === TAB_NAME_TEMPLATE"
      />
    </template>
  </cl-detail-layout>
</template>

<style scoped></style>
