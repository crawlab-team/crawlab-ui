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

const {
  activeId,
  currentBranch,
  gitDataLoading,
  gitLocalBranches,
  gitLocalBranchesDict,
  gitRemoteBranches,
  gitRemoteBranchesDict,
  onClickPull,
  onClickCommit,
} = useGitDetail();

const branchSelectLoading = ref(false);
const onLocalBranchChange = async (branch: string) => {
  branchSelectLoading.value = true;
  try {
    await store.dispatch(`${ns}/checkoutBranch`, {
      id: activeId.value,
      branch,
    });
  } finally {
    await store.dispatch(`${ns}/getCurrentBranch`, { id: activeId.value });
    branchSelectLoading.value = false;
  }
};
const onRemoteBranchChange = async (branch: string) => {
  branchSelectLoading.value = true;
  try {
    await store.dispatch(`${ns}/checkoutRemoteBranch`, {
      id: activeId.value,
      branch,
    });
  } catch (e: any) {
    ElMessage.error(e.message);
  } finally {
    await store.dispatch(`${ns}/getCurrentBranch`, { id: activeId.value });
    branchSelectLoading.value = false;
  }
};

const internalCurrentBranch = ref<string>();
watch(currentBranch, () => {
  internalCurrentBranch.value = currentBranch.value?.name;
});
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
        @retry="() => store.dispatch(`${ns}/getById`, activeId)"
      />
      <div class="branch">
        <cl-git-branch-select
          v-model="internalCurrentBranch"
          :local-branches="gitLocalBranches"
          :remote-branches="gitRemoteBranches"
          :disabled="isDisabled"
          :loading="branchSelectLoading || gitDataLoading"
          @select-local="onLocalBranchChange"
          @select-remote="onRemoteBranchChange"
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
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped lang="scss"></style>
