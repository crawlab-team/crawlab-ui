import { computed, ref, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import useGitService from '@/services/git/gitService';
import { getTabName } from '@/utils/route';
import { ElMessage, ElMessageBox } from 'element-plus';
import { sendEvent } from '@/admin/umeng';
import { translate } from '@/utils/i18n';
import Form from '@/components/form/Form.vue';
import {
  GIT_REF_TYPE_BRANCH,
  GIT_STATUS_CLONING,
  GIT_STATUS_ERROR,
  GIT_STATUS_PENDING,
  GIT_STATUS_READY,
} from '@/constants/git';
import useDetail from '@/layouts/content/detail/useDetail';
import useGit from '@/components/git/git';
import { TAB_NAME_CHANGES, TAB_NAME_OVERVIEW } from '@/constants';

// i18n
const t = translate;

const useGitDetail = () => {
  const ns = 'git';
  const store = useStore();
  const { git: state } = store.state as RootStoreState;

  const router = useRouter();

  const route = useRoute();

  const id = computed<string>(() => route.params.id as string);

  const tabs = computed(() => {
    return state.tabs.map(tab => {
      tab.title = t(tab.title || '');
      tab.disabled = state.disabledTabKeys.includes(tab.id);
      if (tab.id === TAB_NAME_CHANGES) {
        tab.badge = state.gitChanges.length;
        tab.badgeType = 'danger';
      }
      return tab;
    });
  });

  const activeTabName = computed<string>(() => getTabName(router));

  const currentBranch = computed<GitRef | undefined>(() => state.currentBranch);

  const gitDataLoading = computed(() => state.gitDataLoading);

  const gitLocalBranches = computed<GitRef[]>(() => state.gitBranches);
  const gitLocalBranchesDict = computed<Record<string, GitRef>>(() => {
    const dict: Record<string, GitRef> = {};
    gitLocalBranches.value?.forEach(branch => {
      dict[branch.hash || ''] = branch;
    });
    return dict;
  });

  const gitRemoteBranches = computed<GitRef[] | undefined>(
    () => state.gitRemoteBranches
  );
  const gitRemoteBranchesDict = computed<Record<string, GitRef>>(() => {
    const dict: Record<string, GitRef> = {};
    gitRemoteBranches.value?.forEach(branch => {
      dict[branch.hash || ''] = branch;
    });
    return dict;
  });

  // redirect to overview tab if the current tab is disabled
  watch(
    () => state.disabledTabKeys,
    () => {
      if (state.disabledTabKeys.includes(activeTabName.value)) {
        router.push(`/gits/${id.value}/${TAB_NAME_OVERVIEW}`);
      }
    }
  );

  const isDisabled = computed<boolean>(() => {
    const gitForm = state.form;
    return (
      gitForm.status !== GIT_STATUS_READY || !gitForm.url || !gitForm.auth_type
    );
  });

  const commitLoading = ref(false);
  const onCommit = async () => {
    if (!state.gitChangeSelection.length) return;
    const { value: message } = await ElMessageBox.prompt(
      t('components.git.common.messageBox.prompt.commit.title'),
      {
        type: 'info',
        inputPlaceholder: t(
          'components.git.common.messageBox.prompt.commit.placeholder'
        ),
        inputValidator: (value: string) => {
          if (!value) {
            return t(
              'components.git.common.messageBox.prompt.commit.validate.notEmpty'
            );
          }
          return true;
        },
      }
    );
    try {
      await store.dispatch(`${ns}/commit`, {
        id: id.value,
        message,
        changes: state.gitChangeSelection,
      });
      await Promise.all([
        store.dispatch(`${ns}/getChanges`, { id: id.value }),
        store.dispatch(`${ns}/getLogs`, { id: id.value }),
      ]);
    } catch (e: any) {
      ElMessage.error(e.message);
    } finally {
      commitLoading.value = false;
    }
  };

  const rollbackLoading = ref(false);
  const onRollback = async () => {
    if (!state.gitChangeSelection.length) return;
    try {
      await store.dispatch(`${ns}/deleteChanges`, {
        id: id.value,
        changes: state.gitChangeSelection,
      });
      await store.dispatch(`${ns}/getChanges`, { id: id.value });
    } catch (e: any) {
      ElMessage.error(e.message);
    } finally {
      rollbackLoading.value = false;
    }
  };

  return {
    ...useDetail('git'),
    tabs,
    currentBranch,
    gitDataLoading,
    gitLocalBranches,
    gitLocalBranchesDict,
    gitRemoteBranches,
    gitRemoteBranchesDict,
    isDisabled,
    commitLoading,
    onCommit,
    rollbackLoading,
    onRollback,
  };
};

export default useGitDetail;
