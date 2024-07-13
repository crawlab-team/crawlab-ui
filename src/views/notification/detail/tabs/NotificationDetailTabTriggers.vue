<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';

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

defineOptions({ name: 'ClNotificationDetailTabTriggers' });
</script>

<template>
  <div class="notification-detail-tab-triggers">
    <el-form label-width="150px">
      <el-form-item
        :label="t('views.notification.settings.form.triggerTarget')"
      >
        <el-radio-group v-model="triggerTarget">
          <el-radio value="task">
            {{ t('views.notification.triggerTargets.task') }}
          </el-radio>
          <el-radio value="node">
            {{ t('views.notification.triggerTargets.node') }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('views.notification.settings.form.trigger')">
        <el-radio-group v-model="trigger">
          <template v-if="triggerTarget === 'task'">
            <el-radio value="task_finish">
              {{ t('views.notification.triggers.task.finish') }}
            </el-radio>
            <el-radio value="task_error">
              {{ t('views.notification.triggers.task.error') }}
            </el-radio>
            <el-radio value="task_empty_results">
              {{ t('views.notification.triggers.task.emptyResults') }}
            </el-radio>
            <el-radio value="task_never">
              {{ t('views.notification.triggers.task.never') }}
            </el-radio>
          </template>
          <template v-else-if="triggerTarget === 'node'">
            <el-radio value="node_status_change">
              {{ t('views.notification.triggers.node.statusChange') }}
            </el-radio>
            <el-radio value="node_online">
              {{ t('views.notification.triggers.node.online') }}
            </el-radio>
            <el-radio value="node_offline">
              {{ t('views.notification.triggers.node.offline') }}
            </el-radio>
            <el-radio value="node_never">
              {{ t('views.notification.triggers.node.never') }}
            </el-radio>
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
