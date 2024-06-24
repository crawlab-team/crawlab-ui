<script setup lang="ts">
defineOptions({ name: 'ClGitDetailActionsCommon' });
import { TAB_NAME_CHANGES } from '@/constants';
import { h, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { ElMessage, ElMessageBox } from 'element-plus';

const t = translate;

const router = useRouter();

const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

// git form
const gitForm = computed<Git>(() => state.form);

const {
  activeTabName,
  activeId,
  currentBranch,
  gitDataLoading,
  gitLocalBranches,
  gitRemoteBranches,
  isDisabled,
  pullLoading,
  onPull,
  commitLoading,
  onCommit,
  pushLoading,
  onPush,
} = useGitDetail();

const internalCurrentBranch = ref<string>();
watch(currentBranch, () => {
  internalCurrentBranch.value = currentBranch.value?.name;
});

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
    await store.dispatch(`${ns}/getBranches`, { id: activeId.value });
    branchSelectLoading.value = false;
  }
};

const onNewBranch = async () => {
  const { value: targetBranch } = await ElMessageBox.prompt(
    t('components.git.common.messageBox.prompt.branch.new.title'),
    {
      inputValue: currentBranch.value?.name,
      inputValidator: (value: string) => {
        if (!value) {
          return t(
            'components.git.common.messageBox.prompt.branch.new.validate.notEmpty'
          );
        }
        if (value === currentBranch.value?.name) {
          return t(
            'components.git.common.messageBox.prompt.branch.new.validate.notSame'
          );
        }
        return true;
      },
    }
  );
  if (!targetBranch) return;
  const sourceBranch = currentBranch.value?.name;
  branchSelectLoading.value = true;
  try {
    await store.dispatch(`${ns}/newBranch`, {
      id: activeId.value,
      sourceBranch,
      targetBranch,
    });
    await Promise.all([
      store.dispatch(`${ns}/getCurrentBranch`, { id: activeId.value }),
      store.dispatch(`${ns}/getBranches`, { id: activeId.value }),
    ]);
  } catch (e: any) {
    ElMessage.error(e.message);
  } finally {
    branchSelectLoading.value = false;
  }
};

const onDeleteBranch = async (branch: string) => {
  const confirm = await ElMessageBox.confirm(
    () =>
      h('div', [
        t('components.git.common.messageBox.confirm.branch.delete'),
        h(
          'label',
          { style: 'margin-left: 5px;color: var(--cl-danger-color)' },
          [branch]
        ),
      ]),
    {
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
      confirmButtonText: t('common.actions.delete'),
    }
  );
  if (!confirm) return;
  branchSelectLoading.value = true;
  try {
    await store.dispatch(`${ns}/deleteBranch`, {
      id: activeId.value,
      branch,
    });
    await store.dispatch(`${ns}/getBranches`, { id: activeId.value });
  } catch (e: any) {
    ElMessage.error(e.message);
  } finally {
    branchSelectLoading.value = false;
  }
};

const onNewTag = async (tag: string) => {
  // branchSelectLoading.value = true;
  // try {
  //   await store.dispatch(`${ns}/newTag`, {
  //     id: activeId.value,
  //     tag,
  //   });
  //   await store.dispatch(`${ns}/getBranches`, { id: activeId.value });
  // } catch (e: any) {
  //   ElMessage.error(e.message);
  // } finally {
  //   branchSelectLoading.value = false;
  // }
};

const onClickPull = async () => {
  console.debug('onClickPull');
  if (pullLoading.value) return;
  await onPull();
};

const onClickCommit = async () => {
  if (activeTabName.value !== TAB_NAME_CHANGES) {
    router.push(`/gits/${activeId.value}/changes`);
  } else {
    if (commitLoading.value) return;
    await onCommit();
  }
};

const onClickPush = async () => {
  if (pushLoading.value) return;
  await onPush();
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
          @new-branch="onNewBranch"
          @delete-branch="onDeleteBranch"
          @new-tag="onNewTag"
          @pull="onClickPull"
          @commit="onClickCommit"
          @push="onClickPush"
        />
      </div>
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped lang="scss"></style>
