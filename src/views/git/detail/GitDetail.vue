<script setup lang="ts">
import ClGitFileDiffDialog from '@/components/core/git/GitFileDiffDialog.vue';

import { computed, watch, onBeforeUnmount, onBeforeMount, provide } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  FILE_ROOT,
  GIT_STATUS_ERROR,
  GIT_STATUS_READY,
  TAB_NAME_CHANGES,
  TAB_NAME_FILES,
  TAB_NAME_OVERVIEW,
  TAB_NAME_SPIDERS,
} from '@/constants';
import { debounce, translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import useGit from '@/components/core/git/useGit';

const t = translate;

const router = useRouter();

const ns = 'git';
const store = useStore<RootStoreState>();
const { git: state } = store.state;

const {
  activeId,
  activeTabName,
  tabs,
  pullLoading,
  pullBoxVisible,
  pullBoxLogs,
  pushLoading,
  pushBoxVisible,
  pushBoxLogs,
} = useGitDetail();

// update tab disabled keys
const { form } = useGit(store);
let handle: any;
watch(
  form,
  debounce(() => {
    clearInterval(handle);
    handle = setInterval(
      () => store.dispatch(`${ns}/getById`, activeId.value),
      5000
    );
  })
);

// get local and remote branches
const getBranches = debounce(() => {
  reset();
  if (form.value?.status !== GIT_STATUS_READY) return;
  store.dispatch(`${ns}/getCurrentBranch`, { id: activeId.value });
  store.dispatch(`${ns}/getBranches`, { id: activeId.value });
  store.dispatch(`${ns}/getRemoteBranches`, { id: activeId.value });
});
watch(form, getBranches);
onBeforeMount(getBranches);

// get changes
const getChanges = debounce(() => {
  if (form.value?.status !== GIT_STATUS_READY) return;
  store.dispatch(`${ns}/getChanges`, { id: activeId.value });
});
watch(form, getChanges);
onBeforeMount(getChanges);

// reset
const reset = () => {
  store.commit(`${ns}/resetCurrentBranch`);
  store.commit(`${ns}/resetGitBranches`);
  store.commit(`${ns}/resetGitRemoteBranches`);
  store.commit(`${ns}/resetGitChanges`);
  clearInterval(handle);
};
onBeforeUnmount(reset);
watch(activeId, reset);

const spidersDict = computed<{ [key: string]: Spider }>(() => {
  const dict = {} as { [key: string]: Spider };
  (form.value as Git).spiders?.forEach(spider => {
    if (spider.git_root_path === undefined) return;
    dict[spider.git_root_path || FILE_ROOT] = spider;
  });
  return dict;
});

provide<{ (item: FileNavItem): TagProps | undefined }>(
  'highlight-tag-fn',
  (item: FileNavItem) => {
    if (!item.is_dir) return;
    if (!item.path) return;
    const spider = spidersDict.value[item.path];
    if (!spider) return;
    return {
      color: 'var(--cl-primary-color)',
      icon: ['fa', 'spider'],
      tooltip: `${t('components.git.form.spider')}: ${spider.name}`,
    } as TagProps;
  }
);
provide<{ (item: FileNavItem): void }>(
  'highlight-click-fn',
  (item: FileNavItem) => {
    if (!item.is_dir) return;
    if (!item.path) return;
    const spider = spidersDict.value[item.path];
    router.push(`/spiders/${spider._id}`);
  }
);
defineOptions({ name: 'ClGitDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="git" :tabs="tabs">
    <template #actions>
      <cl-git-detail-actions-common />
      <cl-git-detail-actions-changes
        v-if="activeTabName === TAB_NAME_CHANGES"
      />
      <cl-git-detail-actions-files v-if="activeTabName === TAB_NAME_FILES" />
      <cl-git-detail-actions-spiders
        v-if="activeTabName === TAB_NAME_SPIDERS"
      />
    </template>
  </cl-detail-layout>

  <!-- Dialogs (handled by store) -->
  <cl-upload-git-files-dialog />
  <cl-create-git-branch-dialog />
  <cl-git-file-diff-dialog />
  <!-- ./Dialogs -->

  <!-- Boxes -->
  <cl-git-logs-box
    :visible="pullBoxVisible"
    :loading="pullLoading"
    :logs="pullBoxLogs"
    :title="t('components.git.common.box.title.pull')"
  />
  <cl-git-logs-box
    :visible="pushBoxVisible"
    :loading="pushLoading"
    :logs="pushBoxLogs"
    :title="t('components.git.common.box.title.push')"
  />
  <!-- ./Boxes -->
</template>

<style scoped lang="scss"></style>
