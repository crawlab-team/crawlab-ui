<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { translate } from '@/utils';
import { useStore } from 'vuex';
import { TagProps } from '@/components/ui/tag/types';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: state } = store.state as RootStoreState;

const visible = computed(() => state.activeDialogKey === 'logs');

const activeTargetName = computed(() => state.activeTargetName);
const activeTargetStatus = computed(() => state.activeTargetStatus);

const content = computed(() => {
  const data: string[] = [];
  state.activeTargetLogs?.forEach(l => {
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

const previousActiveTargetLogsLength = ref(0);
const getActiveTargetLogs = async () => {
  previousActiveTargetLogsLength.value = state.activeTargetLogs?.length || 0;
  await store.dispatch(`${ns}/getActiveTargetLogs`);
  if (state.activeTargetLogs?.length > previousActiveTargetLogsLength.value) {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }
};

const scrollToBottom = () => {
  logsViewRef.value?.scrollTo(0, logsViewRef.value?.scrollHeight);
};

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
};

let handle: any = null;
watch(visible, async () => {
  if (visible.value) {
    await getActiveTargetLogs();
    handle = setInterval(async () => {
      await getActiveTargetLogs();
    }, 5000);
  } else {
    store.commit(`${ns}/resetActiveTargetId`);
    store.commit(`${ns}/resetActiveTargetName`);
    store.commit(`${ns}/resetActiveTargetStatus`);
    store.commit(`${ns}/resetActiveTargetLogs`);
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
    <template #title>
      <div class="title-wrapper">
        <span>{{ t('common.tabs.logs') }} - {{ activeTargetName }}</span>
      </div>
    </template>
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

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
