<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import * as monaco from 'monaco-editor';
import { useTaskDetail } from '@/views';
import { isCancellable } from '@/utils';
import { useTask } from '@/components';

// store
const ns = 'task';
const store = useStore();
const { task: state, file: fileState } = store.state as RootStoreState;

const { form } = useTask(store);

// use task detail
const { activeId, getForm } = useTaskDetail();

// log div element
const editorRef = ref<HTMLDivElement>();

// log editor
let logEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// content
const content = computed<string>(() => state.logContent);

// pagination
const page = computed<number>(() => state.logPagination.page);
const size = computed<number>(() => state.logPagination.size);

// total
const total = computed<number>(() => state.logTotal);

// id
const id = computed<string>(() => activeId.value);

const resizeObserver = new ResizeObserver(() => {
  setTimeout(() => {
    logEditor?.layout();
  }, 200);
});

// set editor content
watch(content, () => {
  logEditor?.setValue(content.value);
});
// page sizes
const pageSizes = ref<number[]>([1000, 2000, 5000, 10000, 20000, 50000]);

const updateLogs = async () => {
  // skip if active id is empty
  if (!activeId.value) return;

  // update logs
  await store.dispatch(`${ns}/getLogs`, activeId.value);

  // update pagination
  const { logPagination, logTotal } = state;
  const { page, size } = logPagination;
  if (logTotal > size * page) {
    const maxPage = Math.ceil(logTotal / size);
    store.commit(`${ns}/setLogPagination`, {
      page: maxPage,
      size,
    });
  }

  // scroll to bottom
  setTimeout(() => {
    const model = logEditor?.getModel();
    logEditor?.revealLine(model?.getLineCount() || 0);
  }, 100);
};

// pagination change
const onPageChange = (page: number) => {
  store.commit(`${ns}/setLogPagination`, { ...state.logPagination, page });
};
const onSizeChange = (size: number) => {
  store.commit(`${ns}/setLogPagination`, { ...state.logPagination, size });
};
watch(() => state.logPagination, updateLogs);

// active id change
watch(activeId, updateLogs);

// auto update
let autoUpdateHandle: any;
const setupDetail = async () => {
  // Get form data if status is empty
  if (!form.value?.status) {
    await getForm();
  }

  // Set up auto update if status is cancellable
  if (isCancellable(form.value?.status)) {
    autoUpdateHandle = setInterval(async () => {
      // Get form data
      const res = await getForm();

      // Update logs if auto update is enabled
      if (state.logAutoUpdate) {
        await updateLogs();
      }

      // Dispose auto update if status is not cancellable
      if (!isCancellable(res.data.status)) {
        clearInterval(autoUpdateHandle);
      }
    }, 5000);
  }
};

// initialize
onMounted(async () => {
  if (!editorRef.value) return;

  logEditor = monaco.editor.create(editorRef.value, {
    ...fileState.editorOptions,
    readOnly: true,
  });

  resizeObserver.observe(editorRef.value);

  if (content.value) {
    logEditor.setValue(content.value);
  }
});

onBeforeMount(async () => {
  // logs
  await updateLogs();

  // initialize logs auto update
  setTimeout(() => {
    if (isCancellable(form.value?.status)) {
      store.commit(`${ns}/enableLogAutoUpdate`);
    }
  }, 500);

  // setup
  setupDetail();
});
onBeforeUnmount(() => clearInterval(autoUpdateHandle));

// dispose
onUnmounted(() => {
  store.commit(`${ns}/resetLogPagination`);
  if (resizeObserver && editorRef.value) {
    resizeObserver.unobserve(editorRef.value);
  }
  logEditor?.dispose();
});

defineOptions({ name: 'ClTaskDetailTabLogs' });
</script>

<template>
  <div class="task-detail-tab-logs">
    <div class="pagination">
      <el-pagination
        :current-page="page"
        :page-size="size"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </div>
    <div class="log-container">
      <div ref="editorRef" class="log" />
    </div>
  </div>
</template>

<style scoped>
.task-detail-tab-logs {
  height: 100%;

  .pagination {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: start;

    .el-pagination {
      padding: 0 16px;
    }
  }

  .log-container {
    height: calc(100% - 32px);
    position: relative;
    flex: 1;
    display: flex;
    min-width: 100%;
    flex-direction: column;

    .log {
      flex: 1;

      &.hidden {
        position: fixed;
        top: -100vh;
        left: 0;
        height: 100vh;
      }
    }
  }
}
</style>
