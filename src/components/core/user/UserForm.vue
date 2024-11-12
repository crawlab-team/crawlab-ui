<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { ROLE_ADMIN, ROLE_NORMAL } from '@/constants/user';
import useUser from '@/components/core/user/useUser';
import useUserDetail from '@/views/user/detail/useUserDetail';
import { isPro, translate } from '@/utils';
import { useRole } from '@/components';

// i18n
const t = translate;

// store
const store = useStore();

const { activeId } = useUserDetail();

const { onChangePasswordFunc } = useUser(store);

const onChangePassword = () => onChangePasswordFunc(activeId.value);

const isDetail = computed<boolean>(() => !!activeId.value);

const { form, formRef, formRules, isSelectiveForm, isFormItemDisabled } =
  useUser(store);

const { allListSelectOptions: allRolesSelectOptions } = useRole(store);

onBeforeMount(() => {
  store.dispatch('role/getAllList');
});

defineOptions({ name: 'ClUserForm' });
</script>

<template>
  <cl-form
    v-if="form"
    ref="formRef"
    :model="form"
    :rules="formRules"
    :selective="isSelectiveForm"
    class="user-form"
  >
    <!-- Row -->
    <cl-form-item
      :span="2"
      :label="t('components.user.form.username')"
      prop="username"
      required
    >
      <el-input
        v-model="form.username"
        :disabled="form.root_admin || isFormItemDisabled('username')"
        :placeholder="t('components.user.form.username')"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.user.form.password')"
      prop="password"
      required
    >
      <el-input
        v-if="isSelectiveForm || !isDetail"
        v-model="form.password"
        :disabled="isFormItemDisabled('password')"
        :placeholder="t('components.user.form.password')"
        type="password"
      />
      <cl-label-button
        v-else
        id="password"
        class-name="password"
        :icon="['fa', 'lock']"
        :label="t('components.user.form.changePassword')"
        type="danger"
        @click="onChangePassword"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="2"
      :label="t('components.user.form.email')"
      prop="email"
    >
      <el-input
        v-model="form.email"
        :disabled="isFormItemDisabled('email')"
        :placeholder="t('components.user.form.email')"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.user.form.role')"
      prop="role_id"
      required
    >
      <template v-if="isPro()">
        <el-select
          v-model="form.role_id"
          :disabled="form.root_admin || isFormItemDisabled('role_id')"
        >
          <el-option
            v-for="op in allRolesSelectOptions"
            :key="op.value"
            :value="op.value"
            :label="op.label"
          />
        </el-select>
      </template>
      <template v-else>
        <el-select v-model="form.role" :disabled="isFormItemDisabled('role')">
          <el-option
            :value="ROLE_ADMIN"
            :label="t('components.user.role.admin')"
          />
          <el-option
            :value="ROLE_NORMAL"
            :label="t('components.user.role.normal')"
          />
        </el-select>
      </template>
    </cl-form-item>
    <!-- ./Row -->
  </cl-form>
</template>
