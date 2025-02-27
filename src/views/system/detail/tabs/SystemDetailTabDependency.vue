<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import { ClForm } from '@/components';
import { translate } from '@/utils';
import { ElMessage } from 'element-plus';

const t = translate;

const ns = 'system';
const store = useStore();
const { system: state } = store.state as RootStoreState;

const key = 'dependency';

const formRef = ref<typeof ClForm>();

const form = computed<Setting<SettingDependency>>({
  get: () => state.settings[key],
  set: value => {
    store.commit(`${ns}/setSetting`, { key, value });
  },
});
onBeforeMount(async () => {
  await store.dispatch(`${ns}/getSetting`, { key });
});

const save = async () => {
  await formRef.value?.validate();
  await store.dispatch(`${ns}/saveSetting`, { key, value: form.value });
  ElMessage.success(t('common.message.success.save'));
};

const onSave = async () => {
  await save();
};

defineExpose({
  save,
});

defineOptions({ name: 'ClSystemDetailTabDependency' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form.value" label-width="200px">
    <cl-form-item
      :span="4"
      :label="t('views.system.dependency.autoInstall')"
      prop="show_custom_title"
    >
      <cl-switch v-model="form.value.auto_install" @change="onSave" />
    </cl-form-item>
  </cl-form>
</template>

<style scoped>
.form {
  padding: 20px;
}
</style>
