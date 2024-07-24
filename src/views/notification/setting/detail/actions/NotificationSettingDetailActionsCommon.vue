<script setup lang="tsx">
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import { ElMessageBox } from 'element-plus';

const t = translate;

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

const getTriggerTarget = (
  trigger?: NotificationTrigger
): NotificationTriggerTarget | undefined => {
  if (trigger?.startsWith('task')) {
    return 'task';
  } else if (trigger?.startsWith('node')) {
    return 'node';
  } else {
    return;
  }
};

const triggerTarget = ref<NotificationTriggerTarget>(
  state.form.trigger_target || getTriggerTarget(state.form.trigger) || 'task'
);
watch(triggerTarget, val => {
  let _trigger: NotificationTrigger;
  switch (val) {
    case 'task':
      _trigger = 'task_finish';
      break;
    case 'node':
      _trigger = 'node_status_change';
      break;
  }
  trigger.value = _trigger;
  store.commit(`${ns}/setForm`, {
    ...state.form,
    trigger_target: val,
    trigger: _trigger,
  } as NotificationSetting);
});

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
      triggerTarget.value = val.trigger_target || 'task';
      trigger.value = val.trigger || 'task_finish';
      return;
    }

    // compatible with old data
    if (val.task_trigger && !val.trigger) {
      store.commit(`${ns}/setForm`, {
        ...state.form,
        trigger_target: 'task',
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
