<script setup lang="ts">
defineOptions({ name: 'ClGitLogsDialog' });
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import { GIT_STATUS_CLONING } from '@/constants';
import useGit from '@/components/git/useGit';
import ClLogsView from '@/views/deps/task/LogsView.vue';

const t = translate;

const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeDialogKey } = useGit(store);

const dialogVisible = computed(() => activeDialogKey.value === 'logs');

const logsViewRef = ref<typeof ClLogsView>();

let handle: number;
const update = () => {
  if (dialogVisible) {
    handle = setInterval(async () => {
      if (!state.form?._id) return;
      await store.dispatch(`${ns}/getById`, state.form?._id);
      if (state.form?.status !== GIT_STATUS_CLONING) {
        clearInterval(handle);
      }
    }, 5000);
    setTimeout(() => {
      logsViewRef.value?.scrollToBottom();
      console.debug(logsViewRef.value?.scrollToBottom);
    }, 0);
  } else {
    clearInterval(handle);
  }
};
watch(dialogVisible, update);
onMounted(update);
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

<style scoped lang="scss"></style>
