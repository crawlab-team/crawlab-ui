<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import useGitDetail from '@/views/git/detail/useGitDetail';

const { activeTabName } = useGitDetail();

const ns = 'git';
const store = useStore();

onBeforeUnmount(() => store.commit(`${ns}/resetGitData`));
onBeforeUnmount(() => store.commit(`${ns}/resetGitBranches`));
</script>

<template>
  <cl-detail-layout store-namespace="git">
    <template #actions>
      <cl-git-detail-actions-common />
      <cl-git-detail-actions-files v-if="activeTabName === 'files'" />
    </template>
  </cl-detail-layout>

  <!-- Dialogs (handled by store) -->
  <cl-upload-spider-files-dialog />
  <!-- ./Dialogs -->
</template>

<style scoped lang="scss"></style>
