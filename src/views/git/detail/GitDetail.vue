<script setup lang="ts">
defineOptions({ name: 'ClGitDetail' });
import { watch, onBeforeUnmount, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import useGitDetail from '@/views/git/detail/useGitDetail';
import useGit from '@/components/git/useGit';
import {
  GIT_STATUS_ERROR,
  GIT_STATUS_READY,
  TAB_NAME_CHANGES,
  TAB_NAME_FILES,
  TAB_NAME_OVERVIEW,
  TAB_NAME_SPIDERS,
} from '@/constants';
import { debounce } from '@/utils';

const ns = 'git';
const store = useStore<RootStoreState>();
const { git: state } = store.state;

const { activeId, activeTabName, tabs } = useGitDetail();

// update tab disabled keys
const { form } = useGit(store);
let handle = 0;
watch(
  form,
  debounce(() => {
    clearInterval(handle);
    const { status } = form.value as Git;
    if (status === GIT_STATUS_READY) {
      store.commit(`${ns}/resetDisabledTabKeys`);
    } else {
      store.commit(
        `${ns}/setDisabledTabKeys`,
        state.tabs.map(tab => tab.id).filter(id => id !== TAB_NAME_OVERVIEW)
      );
      if (status === GIT_STATUS_ERROR) {
        return;
      }
      handle = setInterval(
        () => store.dispatch(`${ns}/getById`, activeId.value),
        5000
      );
    }
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
  <!-- ./Dialogs -->
</template>

<style scoped lang="scss"></style>
