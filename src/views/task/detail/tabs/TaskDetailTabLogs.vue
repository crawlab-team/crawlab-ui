<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import * as monaco from 'monaco-editor';
import useTaskDetail from '@/views/task/detail/useTaskDetail';
import { isCancellable } from '@/utils';

export default defineComponent({
  name: 'TaskDetailTabLogs',
  setup() {
    // store
    const ns = 'task';
    const store = useStore();
    const { task: state, file: fileState } = store.state as RootStoreState;

    // use task detail
    const { form, activeId } = useTaskDetail();

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

    // pagination change
    const onPageChange = (page: number) => {
      store.commit(`${ns}/setLogPagination`, { ...state.logPagination, page });
    };
    const onSizeChange = (size: number) => {
      store.commit(`${ns}/setLogPagination`, { ...state.logPagination, size });
    };
    watch(
      () => state.logPagination,
      async () => {
        await store.dispatch(`${ns}/getLogs`, id.value);
      }
    );

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

    // auto update
    let autoUpdateHandle: number;
    const setupDetail = () => {
      if (isCancellable(form.value?.status)) {
        // @ts-ignore
        autoUpdateHandle = setInterval(async () => {
          // form data
          const res = await store.dispatch(`${ns}/getById`, activeId.value);

          // logs
          if (state.logAutoUpdate) {
            await updateLogs();
          }

          // dispose
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
      store.commit(`${ns}/setLogEditor`, undefined);
    });

    return {
      editorRef,
      page,
      size,
      total,
      pageSizes,
      onPageChange,
      onSizeChange,
    };
  },
});
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

<style lang="scss" scoped>
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