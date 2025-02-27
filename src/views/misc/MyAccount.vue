<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { translate, plainClone } from '@/utils';
import { debounce } from 'lodash';

// i18n
const t = translate;

// store
const ns: StoreNamespace = 'common';
const store = useStore();
const { common: state } = store.state as RootStoreState;

const form = ref<User>({});

const initializeForm = debounce(() => {
  if (state.me) {
    form.value = plainClone<User>(state.me);
  }
});

onBeforeMount(initializeForm);
watch(() => state.me, initializeForm);

const onSave = async () => {
  await store.dispatch(`${ns}/putMe`, form.value);
  ElMessage.success(t('common.message.success.save'));
  await store.dispatch(`${ns}/getMe`);
};

const onChangePassword = async () => {
  const { value } = await ElMessageBox.prompt(
    t('components.user.messageBox.prompt.changePassword'),
    t('components.user.form.changePassword'),
    {
      inputType: 'password',
      inputPlaceholder: t('components.user.form.newPassword'),
      inputValidator: (value: string) => {
        return value?.length < 5
          ? t('components.user.rules.invalidPassword')
          : true;
      },
      confirmButtonClass: 'edit-user-password-confirm-btn',
      cancelButtonClass: 'edit-user-password-cancel-btn',
    }
  );
  await store.dispatch(`${ns}/changeMyPassword`, { password: value });
  ElMessage.success(t('common.message.success.save'));
};
defineOptions({ name: 'ClMyAccount' });
</script>

<template>
  <div class="my-account">
    <cl-simple-layout padding="0">
      <cl-nav-actions ref="navActions" class="nav-actions">
        <cl-nav-action-group>
          <cl-nav-action-item>
            <cl-nav-action-button
              :icon="['fa', 'save']"
              button-type="label"
              :label="t('components.nav.actions.save')"
              type="success"
              @click="onSave"
            />
          </cl-nav-action-item>
        </cl-nav-action-group>
      </cl-nav-actions>
      <cl-user-form
        :form="form"
        is-edit
        :on-change-password="onChangePassword"
      />
    </cl-simple-layout>
  </div>
</template>

<style scoped>
.my-account {
  height: 100%;

  .user-form {
    margin-top: 20px;
  }
}
</style>
