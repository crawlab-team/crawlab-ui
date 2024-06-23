<script setup lang="ts">
defineOptions({ name: 'ClGitDetailActionsChanges' });
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';

const t = translate;

const ns = 'git';
const store = useStore<RootStoreState>();
const { git: state } = store.state;
const {
  isDisabled,
  commitLoading,
  onCommit,
  rollbackLoading,
  onRollback,
  pullLoading,
  onPull,
  pushLoading,
  onPush,
} = useGitDetail();
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-item>
      <cl-label-button
        :loading="commitLoading"
        :icon="['fa', 'code-commit']"
        :tooltip="t('components.git.actions.tooltip.commit')"
        :label="t('components.git.actions.label.commit')"
        type="primary"
        :disabled="isDisabled || !state.gitChangeSelection.length"
        @click="onCommit"
      />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-label-button
        :loading="rollbackLoading"
        :icon="['fa', 'undo']"
        :tooltip="t('components.git.actions.tooltip.rollback')"
        :label="t('components.git.actions.label.rollback')"
        type="info"
        :disabled="isDisabled || !state.gitChangeSelection.length"
        @click="onRollback"
      />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-label-button
        :loading="pullLoading"
        :icon="['fa', 'cloud-download-alt']"
        :tooltip="t('components.git.actions.tooltip.pull')"
        :label="t('components.git.actions.label.pull')"
        type="primary"
        :disabled="isDisabled"
        @click="onPull"
      />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-label-button
        :loading="pushLoading"
        :icon="['fa', 'cloud-upload-alt']"
        :tooltip="t('components.git.actions.tooltip.push')"
        :label="t('components.git.actions.label.push')"
        type="primary"
        :disabled="isDisabled"
        @click="onPush"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped lang="scss"></style>
