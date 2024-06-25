<script setup lang="ts">
defineOptions({ name: 'ClProjectForm' });
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import useProject from '@/components/project/useProject';

// i18n
const { t } = useI18n();

// store
const store = useStore();
const { form, formRef, formRules, isSelectiveForm, isFormItemDisabled } =
  useProject(store);
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
        v-locate="'name'"
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
        v-locate="'description'"
        v-model="form.description"
        :disabled="isFormItemDisabled('description')"
        :placeholder="t('components.project.form.description')"
        type="textarea"
      />
    </cl-form-item>
  </cl-form>
</template>

<style lang="scss" scoped></style>
