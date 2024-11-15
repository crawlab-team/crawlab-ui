<script setup lang="ts">
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
defineOptions({ name: 'ClGitDetailActionsChanges' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fab', 'git']" />
    <cl-nav-action-item>
      <cl-fa-icon-button
        :loading="commitLoading"
        :icon="['fa', 'code-commit']"
        :tooltip="t('components.git.actions.tooltip.commit')"
        type="primary"
        :disabled="isDisabled || !state.gitChangeSelection.length"
        @click="onCommit"
      />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-fa-icon-button
        :loading="rollbackLoading"
        :icon="['fa', 'undo']"
        :tooltip="t('components.git.actions.tooltip.rollback')"
        type="info"
        :disabled="isDisabled || !state.gitChangeSelection.length"
        @click="onRollback"
      />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-fa-icon-button
        :loading="pullLoading"
        :icon="['fa', 'cloud-download-alt']"
        :tooltip="t('components.git.actions.tooltip.pull')"
        type="primary"
        :disabled="isDisabled"
        @click="onPull"
      />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-fa-icon-button
        :loading="pushLoading"
        :icon="['fa', 'cloud-upload-alt']"
        :tooltip="t('components.git.actions.tooltip.push')"
        type="primary"
        :disabled="isDisabled"
        @click="onPush"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>
