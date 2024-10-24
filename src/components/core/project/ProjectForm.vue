<script setup lang="ts">
import { useStore } from 'vuex';
import useProject from '@/components/core/project/useProject';
import { translate } from '@/utils';

// i18n
const t = translate;

// store
const store = useStore();
const { form, formRef, formRules, isSelectiveForm, isFormItemDisabled } =
  useProject(store);
defineOptions({ name: 'ClProjectForm' });
</script>

<template>
  <cl-form
    v-if="form"
    ref="formRef"
    :model="form"
    :rules="formRules"
    :selective="isSelectiveForm"
  >
    <cl-form-item
      :span="2"
      :offset="2"
      :label="t('components.project.form.name')"
      not-editable
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :disabled="isFormItemDisabled('name')"
        :placeholder="t('components.project.form.name')"
      />
    </cl-form-item>
    <cl-form-item
      :span="4"
      :label="t('components.project.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        :disabled="isFormItemDisabled('description')"
        :placeholder="t('components.project.form.description')"
        type="textarea"
      />
    </cl-form-item>
  </cl-form>
</template>


