<script setup lang="ts">
defineOptions({ name: 'ClGitDetailActionsCommon' });
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { ElMessage, ElMessageBox, ElSelect } from 'element-plus';
import { GIT_STATUS_READY } from '@/constants';
import ClFormItem from '@/components/form/FormItem.vue';

const t = translate;

const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

// git form
const gitForm = computed<Git>(() => state.form);

const isDisabled = computed<boolean>(
  () =>
    gitForm.value.status !== GIT_STATUS_READY ||
    !gitForm.value.url ||
    !gitForm.value.auth_type
);

const gitCurrentBranchRef = ref<typeof ElSelect>();

const {
  activeId,
  gitCurrentBranch,
  gitDataLoading,
  gitLocalBranches,
  gitLocalBranchesDict,
  gitRemoteBranches,
  gitRemoteBranchesDict,
  onClickPull,
  onClickCommit,
} = useGitDetail();

const isBranchClicked = ref<boolean>(false);

const branchSelectLoading = ref(false);
const onBranchChange = async (branch: string) => {
  branchSelectLoading.value = true;
  try {
    await store.dispatch(`${ns}/gitCheckoutBranch`, {
      id: activeId.value,
      branch,
    });
    await store.dispatch(`${ns}/getGit`, { id: activeId.value });
  } finally {
    branchSelectLoading.value = false;
  }
};

const currentBranch = ref<string>();
watch(gitCurrentBranch, () => {
  if (!gitCurrentBranch.value) return;
  currentBranch.value = gitCurrentBranch.value || '';
});

const getRemoteBranchFromLocalBranch = (localBranch: GitRef) => {
  if (!localBranch.hash) return;
  return gitRemoteBranchesDict.value[localBranch.hash]?.name;
};

const onClickNewBranch = () => {
  gitCurrentBranchRef.value?.blur();
  store.commit(`${ns}/showDialog`, 'createBranch');
};

const onBranchClick = () => {
  isBranchClicked.value = true;
};

const onBranchCancel = () => {
  isBranchClicked.value = false;
};

const onBranchCheckout = () => {
  isBranchClicked.value = false;
};

const onAutoPullChange = async () => {
  await store.dispatch(`${ns}/updateById`, {
    id: gitForm.value._id,
    form: gitForm.value,
  });
  ElMessage.success(t('common.message.success.save'));
};
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'code-branch']"
      :tooltip="t('components.git.actions.title')"
    />
    <cl-nav-action-item>
      <cl-git-status
        size="large"
        :id="gitForm._id"
        :status="gitForm.status"
        :error="gitForm.error"
      />
      <div class="branch">
        <cl-git-branch-select
          v-model="currentBranch"
          :local-branches="gitLocalBranches"
          :remote-branches="gitRemoteBranches"
          :disabled="isDisabled"
          :loading="branchSelectLoading || gitDataLoading"
          @change="onBranchChange"
        />
      </div>
      <cl-fa-icon-button
        :icon="['fa', 'download']"
        :tooltip="t('components.git.actions.tooltip.pull')"
        type="primary"
        :disabled="isDisabled"
        @click="onClickPull"
      />
      <cl-fa-icon-button
        :icon="['fa', 'upload']"
        :tooltip="t('components.git.actions.tooltip.commit')"
        type="success"
        :disabled="isDisabled"
        @click="onClickCommit"
      />
      <!--      <cl-switch-->
      <!--        v-model="gitForm.auto_pull"-->
      <!--        :active-text="t('components.git.form.autoPull')"-->
      <!--        :disabled="gitForm.url === '' || gitForm.auth_type === ''"-->
      <!--        @change="onAutoPullChange"-->
      <!--      />-->
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped lang="scss"></style>
