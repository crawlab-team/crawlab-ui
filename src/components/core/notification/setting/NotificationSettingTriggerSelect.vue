<script setup lang="tsx">
import { computed } from 'vue';
import { getTriggerOptions } from '@/utils';

const trigger = defineModel<NotificationTrigger>();

defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'trigger-change', value: NotificationTrigger): void;
}>();

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

const triggerOptions = computed<SelectOption<string>[]>(() =>
  getTriggerOptions()
);

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

defineOptions({ name: 'ClNotificationSettingTriggerSelect' });
</script>

<template>
  <el-tree-select
    popper-class="notification-trigger-select"
    v-model="trigger"
    :data="triggerOptions"
    accordion
    :disabled="disabled"
    @change="(val: NotificationTrigger) => emit('trigger-change', val)"
  >
    <template #label="{ value, label }">
      <template v-if="value === 'alert'">
        <span style="margin-right: 5px">
          <cl-icon :icon="['fa', 'bell']" />
        </span>
      </template>
      <template v-else>
        <span style="margin-right: 5px">
          <cl-icon :icon="getTriggerTargetIcon(value)" />
        </span>
        <span style="margin-right: 5px">
          <cl-icon :icon="getTriggerIcon(value)" />
        </span>
      </template>
      <span style="margin-right: 5px">
        {{ label }}
      </span>
    </template>
    <template #default="{ data }">
      <cl-icon :icon="data.icon" />
      <span style="margin-left: 5px">{{ data.label }}</span>
    </template>
  </el-tree-select>
</template>

<style>
.notification-trigger-select .el-tree-node__content {
  height: 36px;
}
</style>
