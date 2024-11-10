<script setup lang="ts">
import { useStore } from 'vuex';
import { getRouteSelectOptions, translate } from '@/utils';
import { useRoleDetail } from '@/views';
import useRole from '@/components/core/role/useRole';

// i18n
const t = translate;

// store
const store = useStore();

const { activeId } = useRoleDetail();

const {
  form,
  formRef,
  formRules,
  isSelectiveForm,
  isFormItemDisabled,
  routesOptions,
} = useRole(store);

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

    <cl-form-item
      :span="4"
      :label="t('components.role.form.pages')"
      prop="routes"
    >
      <cl-tag
        v-for="(op, $index) in routesOptions"
        :key="$index"
        :label="op.label"
      />
    </cl-form-item>
  </cl-form>
</template>
