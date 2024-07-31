<script setup lang="tsx">
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';
import { getTriggerTarget, translate } from '@/utils';

const t = translate;

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

const triggerTarget = ref<NotificationTriggerTarget | undefined>(
  getTriggerTarget(state.form.trigger)
);

const trigger = ref<NotificationTrigger | undefined>(
  state.form.trigger || 'task_finish'
);
watch<NotificationTrigger | undefined>(trigger, val => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    trigger: val,
  });
});
watch<NotificationSetting>(
  () => state.form,
  (val, prev) => {
    if (val._id !== prev._id) {
      trigger.value = val.trigger || 'task_finish';
      return;
    }

    // compatible with old data
    if (val.task_trigger && !val.trigger) {
      store.commit(`${ns}/setForm`, {
        ...state.form,
        trigger: val.task_trigger,
        task_trigger: '',
      } as NotificationSetting);
    }
  }
);

const onTriggerChange = async (value: NotificationTrigger) => {
  const target = getTriggerTarget(value);
  if (target !== triggerTarget.value) {
    await ElMessageBox.confirm(
      <div>
        <p>{t('common.messageBox.confirm.continue')}</p>
        <p>
          <strong>
            {t('components.notification.trigger.target.change.note')}
          </strong>
        </p>
      </div>,
      t('components.notification.trigger.target.change.label'),
      {
        type: 'warning',
      }
    );
  }
  if (target) triggerTarget.value = target;
  trigger.value = value;
};

defineOptions({ name: 'ClNotificationSettingDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'bolt']"
      :tooltip="t('components.notification.trigger.tooltip')"
    />
    <cl-nav-action-item>
      <cl-notification-setting-trigger-select
        v-model="trigger"
        :disabled="state.form.trigger === 'alert'"
        @trigger-change="onTriggerChange"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped>
.nav-action-group {
  &:deep(.el-select) {
    width: 240px;
    margin-right: 10px;
  }
}
</style>
