<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  translate,
  allVariables,
  triggerTargetVariableCategoryMap,
  getTriggerTarget,
} from '@/utils';
import { useStore } from 'vuex';

const modelValue = defineModel<NotificationVariable | undefined>({
  required: true,
});

defineProps<{
  visible?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const t = translate;

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

const variableCategoryOptions = computed<
  SelectOption<NotificationVariableCategory>[]
>(() => {
  return [
    {
      label: t('components.notification.variableCategories.task'),
      value: 'task',
      icon: ['fa', 'tasks'],
    },
    {
      label: t('components.notification.variableCategories.spider'),
      value: 'spider',
      icon: ['fa', 'spider'],
    },
    {
      label: t('components.notification.variableCategories.schedule'),
      value: 'schedule',
      icon: ['fa', 'calendar-alt'],
    },
    {
      label: t('components.notification.variableCategories.node'),
      value: 'node',
      icon: ['fa', 'server'],
    },
    {
      label: t('components.notification.variableCategories.alert'),
      value: 'alert',
      icon: ['fa', 'bell'],
    },
    {
      label: t('components.notification.variableCategories.metric'),
      value: 'metric',
      icon: ['fa', 'chart-line'],
    },
  ].filter(op => {
    const target = getTriggerTarget(state.form?.trigger);
    if (!target) return true;
    return triggerTargetVariableCategoryMap[target]?.includes(op.value as any);
  }) as SelectOption<NotificationVariableCategory>[];
});

const onConfirm = () => {
  emit('confirm');
};

const category = ref<NotificationVariableCategory | undefined>(
  variableCategoryOptions.value[0]?.value
);
watch(
  () => variableCategoryOptions.value,
  () => {
    category.value = variableCategoryOptions.value[0]?.value;
  }
);

const variables = computed<NotificationVariable[]>(() =>
  allVariables.filter(v => {
    if (!category.value) return false;
    if (!v.category.startsWith(category.value)) return false;
    const target = getTriggerTarget(state.form?.trigger);
    if (!target) return true;
    return !triggerTargetVariableCategoryMap[target]?.includes(v.name as any);
  })
);

defineOptions({ name: 'ClInsertVariableDialog' });
</script>

<template>
  <cl-dialog
    :title="t('components.notification.dialog.insertVariable.title')"
    :title-icon="['fa', 'dollar']"
    :visible="visible"
    :confirm-disabled="!modelValue"
    @close="emit('close')"
    @confirm="onConfirm"
  >
    <cl-form ref="formRef">
      <cl-form-item
        :span="4"
        :label="
          t(
            'components.notification.dialog.insertVariable.form.variableCategory'
          )
        "
      >
        <el-radio-group v-model="category">
          <el-radio-button
            v-for="op in variableCategoryOptions"
            :key="op.value"
            :value="op.value"
          >
            <span style="margin-right: 5px">
              <cl-icon :icon="op.icon" />
            </span>
            <span>{{ op.label }}</span>
          </el-radio-button>
        </el-radio-group>
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="
          t('components.notification.dialog.insertVariable.form.variable')
        "
        required
      >
        <div>
          <el-check-tag
            v-for="v in variables"
            :key="v.name"
            :checked="modelValue?.name === v.name"
            type="primary"
            @change="
              (checked: boolean) => (modelValue = checked ? v : undefined)
            "
          >
            <span style="margin-right: 5px">
              <cl-icon :icon="v.icon" />
            </span>
            <span>{{ v.label }}</span>
          </el-check-tag>
        </div>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>

<style scoped>
.form {
  &:deep(.el-check-tag) {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
