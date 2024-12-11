<script setup lang="ts">
import { useStore } from 'vuex';
import useNode from '@/components/core/node/useNode';
import { translate } from '@/utils';
import { ref, watch } from 'vue';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const t = translate;

// store
const store = useStore();

const { form, formRef, isSelectiveForm, isFormItemDisabled } = useNode(store);

const originalMaxRunners = ref(0);
const isUnlimitedMaxRunners = ref(false);
watch(isUnlimitedMaxRunners, () => {
  if (isUnlimitedMaxRunners.value) {
    form.value.max_runners = 0;
  } else {
    form.value.max_runners = originalMaxRunners.value || 16;
  }
});
watch(
  () => form.value.max_runners,
  val => {
    isUnlimitedMaxRunners.value = val! <= 0;
    originalMaxRunners.value = val!;
  },
  { immediate: true }
);

defineOptions({ name: 'ClNodeForm' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form" :selective="isSelectiveForm">
    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.node.form.name')"
      not-editable
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :disabled="isFormItemDisabled('name')"
        :placeholder="t('components.node.form.name')"
      />
    </cl-form-item>
    <cl-form-item
      v-if="readonly"
      :span="2"
      :label="t('components.node.form.key')"
      not-editable
      prop="key"
    >
      <el-input :model-value="form.key" disabled />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.node.form.type')"
      not-editable
      prop="type"
    >
      <cl-node-type :is-master="form.is_master" />
    </cl-form-item>
    <cl-form-item :span="2" :label="t('components.node.form.ip')" prop="ip">
      <el-input
        v-model="form.ip"
        :disabled="isFormItemDisabled('ip')"
        :placeholder="t('components.node.form.ip')"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item :span="2" :label="t('components.node.form.mac')" prop="mac">
      <el-input
        v-model="form.mac"
        :disabled="isFormItemDisabled('mac')"
        :placeholder="t('components.node.form.mac')"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.node.form.hostname')"
      prop="hostname"
    >
      <el-input
        v-model="form.hostname"
        :disabled="isFormItemDisabled('hostname')"
        :placeholder="t('components.node.form.hostname')"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.node.form.enabled')"
      prop="enabled"
    >
      <cl-switch
        v-model="form.enabled"
        :disabled="isFormItemDisabled('enabled')"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.node.form.maxRunners')"
      prop="max_runners"
    >
      <el-input-number
        v-model="form.max_runners"
        :disabled="isUnlimitedMaxRunners || isFormItemDisabled('max_runners')"
        :min="0"
        :placeholder="t('components.node.form.maxRunners')"
      />
      <el-checkbox
        v-model="isUnlimitedMaxRunners"
        :disabled="isFormItemDisabled('max_runners')"
      >
        {{ t('common.mode.unlimited') }}
      </el-checkbox>
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="4"
      :label="t('components.node.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        :disabled="isFormItemDisabled('description')"
        :placeholder="t('components.node.form.description')"
        type="textarea"
      />
    </cl-form-item>
  </cl-form>
  <!--./Row-->
</template>
