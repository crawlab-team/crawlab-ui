<script setup lang="ts">
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useRole from '@/components/core/role/useRole';

// i18n
const t = translate;

// store
const store = useStore();

const { form, formRef, isSelectiveForm, isFormItemDisabled } = useRole(store);

defineOptions({ name: 'ClRoleForm' });
</script>

<template>
  <cl-form
    v-if="form"
    ref="formRef"
    :model="form"
    :selective="isSelectiveForm"
    class="user-form"
  >
    <!-- Row -->
    <cl-form-item
      :span="4"
      :label="t('components.role.form.name')"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :disabled="isFormItemDisabled('name')"
        :placeholder="t('components.role.form.name')"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="4"
      :label="t('components.role.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        :disabled="isFormItemDisabled('description')"
        :placeholder="t('components.role.form.description')"
        type="textarea"
        id="description"
        class="description"
      />
    </cl-form-item>
    <!-- ./Row -->
  </cl-form>
</template>
