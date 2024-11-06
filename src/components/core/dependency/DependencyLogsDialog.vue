<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { translate } from '@/utils';
import { useStore } from 'vuex';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: state } = store.state as RootStoreState;

const visible = computed(() => state.activeDialogKey === 'logs');

const content = computed(() => {
  const data: string[] = [];
  state.activeDependencyLogs?.forEach(l => {
    l.content
      ?.trim()
      .split(/[\n\r]/)
      .map(line => {
        data.push(line.trim());
      });
  });
  return data.join('\n');
});

const logsViewRef = ref<HTMLDivElement>();

const scrollToBottom = () => {
  logsViewRef.value?.scrollTo(0, logsViewRef.value?.scrollHeight);
};

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
};

let handle: number | null = null;
watch(visible, () => {
  if (visible.value) {
    store.dispatch(`${ns}/getActiveDependencyLogs`);
    handle = setInterval(() => {
      store.dispatch(`${ns}/getActiveDependencyLogs`);
    }, 5000);
  } else {
    store.commit(`${ns}/resetActiveDependencyLogs`);
    if (handle) {
      clearInterval(handle);
    }
  }
});

defineExpose({
  scrollToBottom,
});
defineOptions({ name: 'ClDependencyLogsDialog' });
</script>

<template>
  <cl-dialog
    :title="t('common.tabs.logs')"
    :visible="visible"
    width="800px"
    @confirm="onClose"
    @close="onClose"
  >
    <div class="logs-view" ref="logsViewRef">
      <pre>{{ content }}</pre>
    </div>
  </cl-dialog>
</template>

<style scoped>
.logs-view {
  border: 1px solid rgb(244, 244, 245);
  padding: 10px;
  overflow: auto;
  min-height: 480px;
  max-height: 560px;
}
</style>
