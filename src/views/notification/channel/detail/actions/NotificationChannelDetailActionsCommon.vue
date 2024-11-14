<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getIconByAction, getIconByRouteConcept, translate } from '@/utils';
import { ACTION_SEND_TEST_MESSAGE } from '@/constants';
import { useNotificationChannelDetail } from '@/views';

const t = translate;

const ns: ListStoreNamespace = 'notificationChannel';
const store = useStore();

const { activeId } = useNotificationChannelDetail();

const sendTestMessageLoading = ref(false);
const onClickSendTestMessage = async () => {
  if (sendTestMessageLoading.value) return;
  await ElMessageBox.confirm(
    t('views.notification.messageBox.confirm.sendTestMessage'),
    t('common.actions.sendTestMessage'),
    {
      confirmButtonText: t('common.actions.confirm'),
      cancelButtonText: t('common.actions.cancel'),
      type: 'warning',
    }
  );
  sendTestMessageLoading.value = true;
  try {
    await store.dispatch(`${ns}/sendTestMessage`, {
      id: activeId.value,
    });
    ElMessage.success(t('views.notification.message.success.sendTestMessage'));
  } catch (e: any) {
    ElMessage.error(e.message);
  } finally {
    sendTestMessageLoading.value = false;
  }
};

defineOptions({ name: 'ClNotificationChannelDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="getIconByRouteConcept('notificationChannel')"
    />
    <cl-nav-action-item>
      <cl-fa-icon-button
        :tooltip="t('common.actions.sendTestMessage')"
        :icon="
          sendTestMessageLoading
            ? ['fa', 'spinner']
            : getIconByAction(ACTION_SEND_TEST_MESSAGE)
        "
        :spin="sendTestMessageLoading"
        :disabled="sendTestMessageLoading"
        @click="onClickSendTestMessage"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>
