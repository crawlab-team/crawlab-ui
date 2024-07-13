<script setup lang="tsx">
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import { ElMessageBox } from 'element-plus';

const ns = 'notification';
const store = useStore();
const { notification: state } = store.state as RootStoreState;

const t = translate;

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

const onTriggerTargetClick = async (
  event: MouseEvent,
  target: NotificationTriggerTarget
) => {
  event.stopPropagation();
  if (target === triggerTarget.value) return;
  await ElMessageBox.confirm(
    <div>
      <p>Are you sure to continue?</p>
      <p>
        <strong>NOTE: Some variables might be unavailable.</strong>
      </p>
    </div>,
    'Change Trigger Target',
    {
      type: 'warning',
    }
  );
  triggerTarget.value = target;
};

defineOptions({ name: 'ClNotificationDetailTabTriggers' });
</script>

<template>
  <div class="notification-detail-tab-triggers">
    <el-form label-width="150px">
      <el-form-item
        :label="t('views.notification.settings.form.triggerTarget')"
      >
        <el-radio-group :model-value="triggerTarget">
          <el-radio-button
            value="task"
            @click="(event: MouseEvent) => onTriggerTargetClick(event, 'task')"
          >
            <cl-icon :icon="['fa', 'tasks']" />
            {{ t('views.notification.triggerTargets.task') }}
          </el-radio-button>
          <el-radio-button
            value="node"
            @click="(event: MouseEvent) => onTriggerTargetClick(event, 'node')"
          >
            <cl-icon :icon="['fa', 'server']" />
            {{ t('views.notification.triggerTargets.node') }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('views.notification.settings.form.trigger')">
        <el-radio-group v-model="trigger">
          <template v-if="triggerTarget === 'task'">
            <el-radio-button value="task_finish">
              <cl-icon :icon="['fa', 'check-circle']" />
              {{ t('views.notification.triggers.task.finish') }}
            </el-radio-button>
            <el-radio-button value="task_error">
              <cl-icon :icon="['fa', 'times-circle']" />
              {{ t('views.notification.triggers.task.error') }}
            </el-radio-button>
            <el-radio-button value="task_empty_results">
              <cl-icon :icon="['fa', 'exclamation-circle']" />
              {{ t('views.notification.triggers.task.emptyResults') }}
            </el-radio-button>
            <el-radio-button value="task_never">
              <cl-icon :icon="['fa', 'ban']" />
              {{ t('views.notification.triggers.task.never') }}
            </el-radio-button>
          </template>
          <template v-else-if="triggerTarget === 'node'">
            <el-radio-button value="node_status_change">
              <cl-icon :icon="['fa', 'exchange-alt']" />
              {{ t('views.notification.triggers.node.statusChange') }}
            </el-radio-button>
            <el-radio-button value="node_online">
              <cl-icon :icon="['fa', 'check-circle']" />
              {{ t('views.notification.triggers.node.online') }}
            </el-radio-button>
            <el-radio-button value="node_offline">
              <cl-icon :icon="['fa', 'times-circle']" />
              {{ t('views.notification.triggers.node.offline') }}
            </el-radio-button>
            <el-radio-button value="node_never">
              <cl-icon :icon="['fa', 'ban']" />
              {{ t('views.notification.triggers.node.never') }}
            </el-radio-button>
          </template>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.notification-detail-tab-triggers {
  height: 100%;
  min-height: 100%;

  .transfer {
    height: 100%;
    min-height: 100%;
  }

  .el-form {
    margin-top: 20px;
  }
}
</style>
