<script setup lang="ts">
defineOptions({ name: 'ClGitDetail' });

import { watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import useGitDetail from '@/views/git/detail/useGitDetail';
import useGit from '@/components/git/git';
import {
  GIT_STATUS_ERROR,
  GIT_STATUS_READY,
  TAB_NAME_OVERVIEW,
} from '@/constants';

const { activeId, activeTabName } = useGitDetail();

const ns = 'git';
const store = useStore<RootStoreState>();
const { git: state } = store.state;

// update tab disabled keys
const { form } = useGit(store);
let handle = 0;
watch(form, () => {
  const { status } = form.value as Git;
  if (status === GIT_STATUS_READY) {
    store.commit(`${ns}/resetDisabledTabKeys`);
    clearInterval(handle);
  } else {
    store.commit(
      `${ns}/setDisabledTabKeys`,
      state.tabs.map(tab => tab.id).filter(id => id !== TAB_NAME_OVERVIEW)
    );
    if (status === GIT_STATUS_ERROR) {
      clearInterval(handle);
    } else {
      handle = setInterval(
        () => store.dispatch(`${ns}/getById`, activeId.value),
        5000
      );
    }
  }
});

onBeforeUnmount(() => store.commit(`${ns}/resetGitData`));
onBeforeUnmount(() => store.commit(`${ns}/resetGitBranches`));
onBeforeUnmount(() => clearInterval(handle));
</script>

<template>
  <cl-detail-layout store-namespace="git">
    <template #actions>
      <cl-git-detail-actions-common />
      <cl-git-detail-actions-files v-if="activeTabName === 'files'" />
    </template>
  </cl-detail-layout>

  <!-- Dialogs (handled by store) -->
  <cl-upload-git-files-dialog />
  <cl-create-git-branch-dialog />
  <!-- ./Dialogs -->
</template>

<style scoped lang="scss"></style>
