<script setup lang="ts">
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useNotificationAlert from '@/components/core/notification/alert/useNotificationAlert';
import { getMetricUnitLabel } from '@/utils/metric';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const t = translate;

// store
const ns: ListStoreNamespace = 'notificationAlert';
const store = useStore();

const {
  form,
  formRef,
  isSelectiveForm,
  metricTargetOptions,
  metricNameOptions,
  operatorOptions,
  lastingSecondsOptions,
  levelOptions,
  validateForm,
} = useNotificationAlert(store);

defineExpose({
  validateForm,
});

defineOptions({ name: 'ClNotificationAlertForm' });
</script>

<template>
  <cl-form
    v-if="form"
    ref="formRef"
    :model="form"
    :selective="isSelectiveForm"
    :grid="8"
  >
    <cl-form-item
      :span="4"
      :label="t('views.notification.alerts.form.name')"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :placeholder="t('views.notification.alerts.form.name')"
      />
    </cl-form-item>
    <cl-form-item
      :span="4"
      :label="t('views.notification.alerts.form.enabled')"
      prop="enabled"
    >
      <cl-switch v-model="form.enabled" />
    </cl-form-item>
    <cl-form-item
      :span="8"
      :label="t('views.notification.alerts.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        type="textarea"
        :placeholder="t('views.notification.alerts.form.description')"
      />
    </cl-form-item>
    <cl-form-item
      :span="8"
      :label="t('views.notification.alerts.form.metricTarget')"
      prop="metric_target_id"
      :required="form.has_metric_target"
    >
      <el-select
        v-model="form.metric_target_id"
        :placeholder="t('views.notification.alerts.form.metricTarget')"
        :disabled="!form.has_metric_target"
        default-first-option
      >
        <el-option
          v-for="op in metricTargetOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
      <el-checkbox v-model="form.has_metric_target">
        {{ t('views.notification.alerts.form.hasMetricTarget') }}
      </el-checkbox>
    </cl-form-item>
    <cl-form-item
      :span="4"
      :label="t('views.notification.alerts.form.alertRule')"
      prop="metric_name"
      required
    >
      <el-select
        class="metric-name-select"
        v-model="form.metric_name"
        :placeholder="t('views.notification.alerts.form.metricName')"
      >
        <el-option
          v-for="op in metricNameOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <cl-form-item :span="1" label-width="0">
      <el-select
        class="operator-select"
        v-model="form.operator"
        :placeholder="t('views.notification.alerts.form.operator')"
      >
        <el-option
          v-for="op in operatorOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <cl-form-item :span="3" label-width="0" prop="target_value" required>
      <el-input
        class="target-value-input"
        v-model="form.target_value"
        :placeholder="t('views.notification.alerts.form.targetValue')"
        type="number"
        @change="
          (val: string) => {
            form.target_value = parseFloat(val);
          }
        "
      >
        <template v-if="form.metric_name" #append>
          {{ getMetricUnitLabel(form.metric_name || '') }}
        </template>
      </el-input>
    </cl-form-item>
    <cl-form-item
      :span="4"
      :offset="4"
      :label="t('views.notification.alerts.form.lastingDuration')"
    >
      <el-select v-model="form.lasting_seconds">
        <el-option
          v-for="op in lastingSecondsOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <cl-form-item
      :span="4"
      :offset="4"
      :label="t('views.notification.alerts.form.level')"
      prop="level"
    >
      <el-select
        v-model="form.level"
        :placeholder="t('views.notification.alerts.form.level')"
      >
        <el-option
          v-for="op in levelOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
  </cl-form>
</template>

<style scoped>
.icon-wrapper {
  display: inline-block;
  text-align: center;
  width: 18px;
  margin-right: 2px;

  &:deep(img) {
    filter: grayscale(100);
  }
}

.el-alert {
  padding: 0 10px;

  &:deep(.el-icon) {
    width: 18px;
  }

  &:deep(.el-link) {
    margin-left: 5px;
  }
}

.metric-target-wrapper {
  display: flex;
  align-items: center;

  .el-checkbox {
    margin-left: 10px;
  }
}

.alert-rule-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;

  .operator-select {
    flex: 0 0 120px;
  }

  .target-value-input {
    flex: 1;
  }
}
</style>
