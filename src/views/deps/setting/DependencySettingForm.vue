<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { translate } from '@/utils';

const t = translate;

export default defineComponent({
  name: 'DependencySettingForm',
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const internalForm = ref({});

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

    return {
      internalForm,
      onChange,
      t,
    };
  },
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
