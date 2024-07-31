import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { getTabName } from '@/utils/route';
import { ElMessage, ElMessageBox } from 'element-plus';
import { translate } from '@/utils/i18n';
import { GIT_STATUS_READY } from '@/constants/git';
import useDetail from '@/layouts/content/detail/useDetail';
import {
  TAB_NAME_CHANGES,
  TAB_NAME_FILES,
  TAB_NAME_LOGS,
  TAB_NAME_OVERVIEW,
} from '@/constants';
import { getRequestBaseUrlWs } from '@/utils';

// i18n
const t = translate;

const pullLoading = ref(false);
const pullBoxVisible = ref(false);
const pullBoxLogs = ref<string[]>([]);
const commitLoading = ref(false);
const rollbackLoading = ref(false);
const pushLoading = ref(false);
const pushBoxLogs = ref<string[]>([]);
const pushBoxVisible = ref(false);

const useGitDetail = () => {
  const ns = 'git';
  const store = useStore();
  const { git: state } = store.state as RootStoreState;

  const router = useRouter();

  const route = useRoute();

  const id = computed<string>(() => route.params.id as string);

  const activeTabName = computed<string>(() => getTabName(router));

  const currentBranch = computed<GitRef | undefined>(() => state.currentBranch);

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
    const fileCount = state.gitChangeSelection.length;
    commitLoading.value = true;
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
      console.debug(
        t('components.git.common.message.success.commit', fileCount, {
          fileCount,
        })
      );
      ElMessage.success(
        t('components.git.common.message.success.commit', fileCount, {
          fileCount,
        })
      );
    } catch (e: any) {
      ElMessage.error(e.message);
    } finally {
      commitLoading.value = false;
    }
  };

  const onRollback = async () => {
    if (!state.gitChangeSelection.length) return;
    rollbackLoading.value = true;
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

  const onPull = async () => {
    pullLoading.value = true;
    try {
      const res = await store.dispatch(`${ns}/pull`, {
        id: id.value,
      });
      if (res.data) {
        ElMessage.info(res.data);
      } else {
        ElMessage.success(t('components.git.common.message.success.pull'));
      }
      if (activeTabName.value === TAB_NAME_FILES) {
        await store.dispatch(`${ns}/listDir`, { id: id.value });
      } else if (activeTabName.value === TAB_NAME_LOGS) {
        await store.dispatch(`${ns}/getLogs`, { id: id.value });
      }
    } catch (e: any) {
      ElMessage.error(e.message);
    } finally {
      pullLoading.value = false;
    }
  };

  const onPullWs = async () => {
    const ws = new WebSocket(
      getRequestBaseUrlWs() + `/gits/${id.value}/pull/ws`
    );
    ws.onopen = () => {
      pullLoading.value = true;
      pullBoxVisible.value = true;
    };
    ws.onmessage = event => {
      if (event.data) pullBoxLogs.value.push(event.data);
    };
    ws.onerror = error => {
      pullLoading.value = false;
      pullBoxVisible.value = false;
      pullBoxLogs.value = [];
      ElMessage.error(error.toString());
    };
    ws.onclose = event => {
      pullLoading.value = false;
      pullBoxVisible.value = false;
      pullBoxLogs.value = [];
      if (event.code === 1000) {
        if (event.reason) {
          ElMessage.info(event.reason);
        } else {
          ElMessage.success(t('components.git.common.message.success.pull'));
          if (activeTabName.value === TAB_NAME_FILES) {
            store.dispatch(`${ns}/listDir`, { id: id.value });
          } else if (activeTabName.value === TAB_NAME_LOGS) {
            store.dispatch(`${ns}/getLogs`, { id: id.value });
          }
        }
      } else {
        ElMessage.error(event.reason);
      }
    };
  };

  const onPush = async () => {
    pushLoading.value = true;
    try {
      const res = await store.dispatch(`${ns}/push`, {
        id: id.value,
      });
      if (res.data) {
        ElMessage.info(res.data);
      } else {
        ElMessage.success(t('components.git.common.message.success.push'));
      }
      if (activeTabName.value === TAB_NAME_LOGS) {
        await Promise.all([
          store.dispatch(`${ns}/getLogs`, { id: id.value }),
          store.dispatch(`${ns}/getRemoteBranches`, { id: id.value }),
        ]);
      }
    } catch (e: any) {
      ElMessage.error(e.message);
    } finally {
      pushLoading.value = false;
    }
  };

  const onPushWs = async () => {
    const ws = new WebSocket(
      getRequestBaseUrlWs() + `/gits/${id.value}/push/ws`
    );
    ws.onopen = () => {
      pushLoading.value = true;
      pushBoxVisible.value = true;
    };
    ws.onmessage = event => {
      if (event.data) pushBoxLogs.value.push(event.data);
    };
    ws.onerror = error => {
      pushLoading.value = false;
      pushBoxVisible.value = false;
      pushBoxLogs.value = [];
      ElMessage.error(error.toString());
    };
    ws.onclose = event => {
      pushLoading.value = false;
      pushBoxVisible.value = false;
      pushBoxLogs.value = [];
      if (event.code === 1000) {
        if (event.reason) {
          ElMessage.info(event.reason);
        } else {
          ElMessage.success(t('components.git.common.message.success.push'));
          if (activeTabName.value === TAB_NAME_LOGS) {
            store.dispatch(`${ns}/getLogs`, { id: id.value });
            store.dispatch(`${ns}/getRemoteBranches`, { id: id.value });
          }
        }
      } else {
        ElMessage.error(event.reason);
      }
    };
  };

  return {
    ...useDetail('git'),
    currentBranch,
    gitLocalBranches,
    gitLocalBranchesDict,
    gitRemoteBranches,
    gitRemoteBranchesDict,
    isDisabled,
    commitLoading,
    onCommit,
    rollbackLoading,
    onRollback,
    pullLoading,
    pullBoxVisible,
    pullBoxLogs,
    onPull,
    pushLoading,
    pushBoxVisible,
    pushBoxLogs,
    onPush,
  };
};

export default useGitDetail;
