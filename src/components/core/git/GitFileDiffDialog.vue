<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { translate } from '@/utils';
import useGit from '@/components/core/git/useGit';
import useGitDetail from '@/views/git/detail/useGitDetail';

const t = translate;

const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;
const { activeDialogKey } = useGit(store);
const { activeId } = useGitDetail();

const dialogVisible = computed(() => activeDialogKey.value === 'diff');

const loading = ref(false);
const getData = async () => {
  loading.value = true;
  try {
    await store.dispatch(`${ns}/gitFileDiff`, { id: activeId.value });
  } catch (e) {
    ElMessage.error((e as Error).message);
  } finally {
    loading.value = false;
  }
};

watch(dialogVisible, () => {
  if (dialogVisible.value) {
    getData();
  } else {
    store.commit(`${ns}/resetGitDiff`);
    store.commit(`${ns}/resetActiveFilePath`);
  }
});

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
  store.commit(`${ns}/resetGitDiff`);
  store.commit(`${ns}/resetActiveFilePath`);
};

const onConfirm = () => {
  store.commit(`${ns}/hideDialog`);
  store.commit(`${ns}/resetGitDiff`);
  store.commit(`${ns}/resetActiveFilePath`);
};
defineOptions({ name: 'ClGitFileDiffDialog' });
</script>

<template>
  <cl-dialog
    :visible="dialogVisible"
    :title="`${t('components.git.diff.title')}: ${state.activeFilePath}`"
    top="5vh"
    width="90vw"
    @close="onClose"
    @confirm="onConfirm"
  >
    <template #title>
      <div
        class="title-wrapper"
        style="display: flex; color: var(--cl-info-color); align-items: center"
      >
        <cl-icon :icon="['fa', 'exchange-alt']" />
        <label style="margin-left: 10px; margin-right: 10px">
          {{ t('components.git.diff.title') }}:
        </label>
        <span style="font-size: 16px">
          {{ state.activeFilePath }}
        </span>
      </div>
    </template>
    <div v-loading="loading" class="git-file-diff">
      <cl-file-diff
        :file-path="state.activeFilePath"
        :diff="state.gitDiff"
        readonly
      />
    </div>
  </cl-dialog>
</template>

<style scoped>
.git-file-diff {
  width: 100%;
  height: max(calc(80vh), 480px);
  overflow: auto;
}
</style>
