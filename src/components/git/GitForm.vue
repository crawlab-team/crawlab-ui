<script setup lang="ts">
defineOptions({ name: 'ClGitForm' });
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useGit from '@/components/git/useGit';

// i18n
const t = translate;

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { form, formRef, isSelectiveForm } = useGit(store);

const onUrlChange = (url: string) => {
  let authType;
  let username;
  let name;
  if (url.match(/^https?:\/\//)) {
    authType = 'http';
    name = url.match(/^https?:\/\/[^\/]+\/(.*?)(\.git)?$/)?.[1] || '';
  } else if (url.match(/^git@/)) {
    authType = 'ssh';
    name = url.match(/^git@[^:]+:(.*?)(\.git)?$/)?.[1] || '';
    username = url.match(/(\w+)@/)?.[1];
  } else {
    authType = '';
    name = '';
  }
  const payload = {
    ...state.form,
    auth_type: authType,
    name,
  };
  if (username) payload.username = username;
  store.commit(`${ns}/setForm`, payload);
};

const onCurrentBranchChange = (currentBranch: string) => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    current_branch: currentBranch,
  });
};

const onUsernameChange = (username: string) => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    username,
  });
};

const onPasswordChange = (password: string) => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    password,
  });
};

const gitBranchSelectOptions = computed<SelectOption[]>(
  () => store.getters['spider/gitBranchSelectOptions']
);

watch(
  () => JSON.stringify(gitBranchSelectOptions.value),
  () => {
    if (
      !state.form.current_branch &&
      gitBranchSelectOptions.value?.length > 0
    ) {
      onCurrentBranchChange(gitBranchSelectOptions.value[0].value);
    }
  }
);
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form" :selective="isSelectiveForm">
    <!--Row-->
    <cl-form-item
      :span="4"
      :label="t('components.git.form.repoUrl')"
      prop="url"
      required
      :rules="{
        message: t('components.git.form.urlInvalid'),
        pattern: /^https?:\/\/|^git@/,
      }"
    >
      <div style="display: flex; align-items: center; gap: 5px">
        <el-input
          v-model="form.url"
          :placeholder="t('components.git.form.repoUrl')"
          id="url"
          class="url"
          @input="onUrlChange"
        />
        <cl-tag
          v-if="form.auth_type"
          type="primary"
          :icon="
            form.auth_type === 'http' ? ['fa', 'fa-link'] : ['fa', 'fa-key']
          "
          :label="form.auth_type?.toUpperCase()"
          size="large"
        />
      </div>
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :offset="2"
      :label="t('components.git.form.name')"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :placeholder="t('components.git.form.name')"
      />
    </cl-form-item>
    <!--./Row-->

    <template v-if="form.auth_type === 'http'">
      <!--Row-->
      <cl-form-item
        :span="2"
        :label="t('components.git.form.username')"
        prop="username"
      >
        <el-input
          v-model="form.username"
          :placeholder="t('components.git.form.username')"
          id="username"
          class="username"
          autocomplete="off"
          @change="onUsernameChange"
        />
      </cl-form-item>
      <cl-form-item
        :span="2"
        :label="t('components.git.form.password')"
        prop="password"
      >
        <el-input
          v-model="form.password"
          :placeholder="t('components.git.form.password')"
          type="password"
          id="password"
          class="password"
          autocomplete="off"
          @change="onPasswordChange"
        />
      </cl-form-item>
      <!--./Row-->
    </template>

    <template v-else-if="form.auth_type === 'ssh'">
      <!--Row-->
      <cl-form-item
        :span="4"
        :label="t('components.git.form.privateKey')"
        prop="password"
      >
        <el-input
          v-model="form.password"
          :placeholder="t('components.git.form.privateKey')"
          type="textarea"
          rows="20"
          id="password"
          class="password"
          @change="onPasswordChange"
        />
      </cl-form-item>
      <!--./Row-->
    </template>
  </cl-form>
</template>

<style lang="scss" scoped></style>
