<script setup lang="tsx">
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  GIT_STATUS_PULLING,
  GIT_STATUS_PUSHING,
  TAB_NAME_CHANGES,
} from '@/constants';
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import useGit from '@/components/core/git/useGit';

const t = translate;

const router = useRouter();

const nsGit: ListStoreNamespace = 'git';
const nsSpider: ListStoreNamespace = 'spider';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { getGitIcon } = useGit(store);

// git form
const gitForm = computed<Git>(() => state.form);

const {
  activeTabName,
  activeId,
  currentBranch,
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
    await store.dispatch(`${nsGit}/checkoutBranch`, {
      id: activeId.value,
      branch,
    });
  } finally {
    await store.dispatch(`${nsGit}/getCurrentBranch`, { id: activeId.value });
    branchSelectLoading.value = false;
  }
};

const onRemoteBranchChange = async (branch: string) => {
  branchSelectLoading.value = true;
  try {
    await store.dispatch(`${nsGit}/checkoutRemoteBranch`, {
      id: activeId.value,
      branch,
    });
  } catch (e: any) {
    ElMessage.error(e.message);
  } finally {
    await store.dispatch(`${nsGit}/getCurrentBranch`, { id: activeId.value });
    await store.dispatch(`${nsGit}/getBranches`, { id: activeId.value });
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
    await store.dispatch(`${nsGit}/newBranch`, {
      id: activeId.value,
      sourceBranch,
      targetBranch,
    });
    await Promise.all([
      store.dispatch(`${nsGit}/getCurrentBranch`, { id: activeId.value }),
      store.dispatch(`${nsGit}/getBranches`, { id: activeId.value }),
    ]);
  } catch (e: any) {
    ElMessage.error(e.message);
  } finally {
    branchSelectLoading.value = false;
  }
};

const onDeleteBranch = async (branch: string) => {
  const message = (
    <div>
      {t('components.git.common.messageBox.confirm.branch.delete')}
      <label style="margin-left: 5px;color: var(--cl-danger-color)">
        {branch}
      </label>
    </div>
  );
  const confirm = await ElMessageBox.confirm(message, {
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
    confirmButtonText: t('common.actions.delete'),
  });
  if (!confirm) return;
  branchSelectLoading.value = true;
  try {
    await store.dispatch(`${nsGit}/deleteBranch`, {
      id: activeId.value,
      branch,
    });
    await store.dispatch(`${nsGit}/getBranches`, { id: activeId.value });
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
  if (pullLoading.value) return;
  await onPull();
};

const onClickCommit = async () => {
  if (activeTabName.value !== TAB_NAME_CHANGES) {
    await router.push(`/gits/${activeId.value}/changes`);
  } else {
    if (commitLoading.value) return;
    await onCommit();
  }
};

const onClickPush = async () => {
  if (pushLoading.value) return;
  await onPush();
};

const loading = computed(
  () =>
    branchSelectLoading.value ||
    pullLoading.value ||
    commitLoading.value ||
    pushLoading.value
);

const createSpiderLoading = computed(() => state.createSpiderLoading);
const onOpenCreateDialog = () => {
  store.dispatch(`${nsGit}/clickCreateSpider`);
};

defineOptions({ name: 'ClGitDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="getGitIcon(gitForm).icon"
      :color="getGitIcon(gitForm).color"
    />
    <cl-nav-action-item>
      <cl-git-status
        v-if="pullLoading"
        :id="activeId"
        size="large"
        :status="GIT_STATUS_PULLING"
      />
      <cl-git-status
        v-else-if="pushLoading"
        :id="activeId"
        size="large"
        :status="GIT_STATUS_PUSHING"
      />
      <cl-git-status
        v-else
        :id="activeId"
        size="large"
        :status="gitForm.status"
        :error="gitForm.error"
        @retry="() => store.dispatch(`${nsGit}/getById`, activeId)"
      />
      <div class="branch">
        <cl-git-branch-select
          v-model="internalCurrentBranch"
          :local-branches="gitLocalBranches"
          :remote-branches="gitRemoteBranches"
          :disabled="isDisabled"
          :loading="loading"
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
    <cl-nav-action-item>
      <cl-fa-icon-button
        :loading="createSpiderLoading"
        :icon="['fa', 'spider']"
        :tooltip="t('components.git.spiders.actions.tooltip.create')"
        type="success"
        :disabled="isDisabled"
        @click="onOpenCreateDialog"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>
