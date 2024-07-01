<script setup lang="ts">
defineOptions({ name: 'ClDependencySettingForm' });
import { onBeforeMount, ref, watch } from 'vue';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    form: EnvDepsSetting;
  }>(),
  {
    form: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'change', value: EnvDepsSetting): void;
}>();

const t = translate;

const internalForm = ref<EnvDepsSetting>({});

const onChange = () => {
  emit('change', internalForm.value);
};

watch(
  () => props.form,
  () => {
    internalForm.value = { ...props.form };
  }
);

onBeforeMount(() => {
  internalForm.value = { ...props.form };
});
</script>

<template>
  <cl-form :key="JSON.stringify(form)" :model="form">
    <cl-form-item
      :span="4"
      prop="key"
      :label="t('views.env.deps.settings.form.key')"
    >
      <el-input v-model="internalForm.key" disabled />
    </cl-form-item>
    <cl-form-item
      :span="4"
      prop="name"
      :label="t('views.env.deps.settings.form.name')"
    >
      <el-input v-model="internalForm.name" disabled />
    </cl-form-item>
    <cl-form-item
      :span="4"
      prop="description"
      :label="t('views.env.deps.settings.form.description')"
    >
      <el-input :model-value="internalForm.description" type="textarea" />
    </cl-form-item>
    <cl-form-item
      :span="4"
      prop="cmd"
      :label="t('views.env.deps.settings.form.cmd')"
    >
      <el-input
        v-model="internalForm.cmd"
        :placeholder="t('views.env.deps.settings.form.cmd')"
        @change="onChange"
      />
    </cl-form-item>
    <cl-form-item
      :span="4"
      prop="proxy"
      :label="t('views.env.deps.settings.form.proxy')"
    >
      <el-input
        v-model="internalForm.proxy"
        :placeholder="t('views.env.deps.settings.form.proxy')"
        @change="onChange"
      />
    </cl-form-item>
  </cl-form>
</template>

<style scoped></style>
