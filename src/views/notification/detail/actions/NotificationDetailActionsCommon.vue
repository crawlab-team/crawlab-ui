<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useStore } from 'vuex';
import { translate } from '@/utils';

const t = translate;

const ns = 'notification';
const store = useStore();
const { notification: state } = store.state as RootStoreState;

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

const triggerOptions = computed<SelectOption<string>[]>(() => [
  {
    label: t('views.notification.triggerTargets.task'),
    icon: ['fa', 'tasks'],
    children: [
      {
        label: t('views.notification.triggers.task.finish'),
        value: 'task_finish',
        icon: ['fa', 'flag-checkered'],
      },
      {
        label: t('views.notification.triggers.task.error'),
        value: 'task_error',
        icon: ['fa', 'times'],
      },
      {
        label: t('views.notification.triggers.task.emptyResults'),
        value: 'task_empty_results',
        icon: ['fa', 'exclamation-circle'],
      },
    ],
  },
  {
    label: t('views.notification.triggerTargets.node'),
    icon: ['fa', 'server'],
    disabled: true,
    children: [
      {
        label: t('views.notification.triggers.node.statusChange'),
        value: 'node_status_change',
        icon: ['fa', 'exchange-alt'],
        disabled: true,
      },
      {
        label: t('views.notification.triggers.node.online'),
        value: 'node_online',
        icon: ['fa', 'check-circle'],
        disabled: true,
      },
      {
        label: t('views.notification.triggers.node.offline'),
        value: 'node_offline',
        icon: ['fa', 'times-circle'],
        disabled: true,
      },
    ],
  },
]);

const getTriggerTargetIcon = (value: NotificationTrigger) => {
  const target = getTriggerTarget(value);
  switch (target) {
    case 'task':
      return ['fa', 'tasks'];
    case 'node':
      return ['fa', 'server'];
  }
};

const getTriggerIcon = (value: NotificationTrigger) => {
  return triggerOptions.value
    .flatMap(o => o.children)
    .find(o => o?.value === value)?.icon;
};

defineOptions({ name: 'ClNotificationDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'bolt']"
      :tooltip="t('components.notification.trigger.tooltip')"
    />
    <cl-nav-action-item>
      <el-tree-select
        popper-class="notification-trigger-select"
        :model-value="trigger"
        :data="triggerOptions"
        accordion
        @change="onTriggerChange"
      >
        <template #label="{ value, label }">
          <span style="margin-right: 5px">
            <cl-icon :icon="getTriggerTargetIcon(value)" />
          </span>
          <span style="margin-right: 5px">
            <cl-icon :icon="getTriggerIcon(value)" />
          </span>
          <span style="margin-right: 5px">
            {{ label }}
          </span>
        </template>
        <template #default="{ data }">
          <cl-icon :icon="data.icon" />
          <span style="margin-left: 5px">{{ data.label }}</span>
        </template>
      </el-tree-select>
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
<style>
.notification-trigger-select .el-tree-node__content {
  height: 36px;
}
</style>
