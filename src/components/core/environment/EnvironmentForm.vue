<script setup lang="ts">
import { getStore } from '@/store';
import useEnvironment from '@/components/core/environment/useEnvironment';
import { translate } from '@/utils';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const t = translate;

// store
const store = getStore();

const { form, formRef, isSelectiveForm, isFormItemDisabled } =
  useEnvironment(store);
defineOptions({ name: 'ClEnvironmentForm' });
</script>

<template>
  <cl-form
    class="environment-form"
    v-if="form"
    ref="formRef"
    :model="form"
    :selective="isSelectiveForm"
  >
    <!--Row-->
    <cl-form-item
      :span="4"
      :label="t('components.environment.form.key')"
      not-editable
      prop="key"
      required
    >
      <el-input
        v-model="form.key"
        :disabled="isFormItemDisabled('key')"
        :placeholder="t('components.environment.form.key')"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="4"
      :label="t('components.environment.form.value')"
      prop="value"
      required
    >
      <el-input
        v-model="form.value"
        :disabled="isFormItemDisabled('value')"
        :placeholder="t('components.environment.form.value')"
      />
    </cl-form-item>
    <!--./Row-->
  </cl-form>
</template>

<style scoped>
.environment-form:deep(.hosts-item .hosts-item-input) {
  width: calc(100% - 10px - (10px + 32px) * 2);
  margin-right: 10px;
}

.environment-form:deep(.hosts-item .el-button) {
  width: 32px;
}
</style>
