<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import { GIT_STATUS_CLONING } from '@/constants';
import useGit from '@/components/core/git/useGit';
import ClLogsView from '@/components/ui/logs/LogsView.vue';

const t = translate;

const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeDialogKey } = useGit(store);

const dialogVisible = computed(() => activeDialogKey.value === 'logs');

const logsViewRef = ref<typeof ClLogsView>();

let handle: any;
const update = () => {
  if (!dialogVisible.value) {
    clearInterval(handle);
    return;
  }

  handle = setInterval(async () => {
    if (!state.form?._id) return;
    await store.dispatch(`${ns}/getById`, state.form?._id);
    if (state.form?.status !== GIT_STATUS_CLONING) {
      clearInterval(handle);
    }
  }, 5000);

  setTimeout(() => {
    logsViewRef.value?.scrollToBottom();
  }, 0);
};
watch(dialogVisible, update);
onMounted(update);
onBeforeUnmount(() => {
  clearInterval(handle);
});

defineOptions({ name: 'ClGitCloneLogsDialog' });
</script>

<template>
  <cl-dialog
    :visible="dialogVisible"
    :title="t('components.git.form.cloneLogs')"
    @close="store.commit(`${ns}/hideDialog`)"
    @confirm="store.commit(`${ns}/hideDialog`)"
  >
    <cl-logs-view ref="logsViewRef" :logs="state.form?.clone_logs || []" />
  </cl-dialog>
</template>
