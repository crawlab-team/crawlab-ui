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
      <div ref="log" class="log"/>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, ref, watch} from 'vue';
import {useStore} from 'vuex';
import * as monaco from "monaco-editor";
import useTaskDetail from '@/views/task/detail/useTaskDetail';

export default defineComponent({
  name: 'TaskDetailTabLogs',
  setup() {
    // store
    const ns = 'task';
    const store = useStore();
    const {task: state, file: fileState} = store.state as RootStoreState;

    // use task detail
    const {
      activeId,
      logEditor,
    } = useTaskDetail();

    // log div element
    const editorRef = ref<HTMLDivElement>();

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
        logEditor.value?.layout();
      }, 200);
    });

    // set editor content
    watch(content, () => {
      logEditor.value?.setValue(content.value);
    });

    // pagination change
    const onPageChange = (page: number) => {
      store.commit(`${ns}/setLogPagination`, {...state.logPagination, page});
    };
    const onSizeChange = (size: number) => {
      store.commit(`${ns}/setLogPagination`, {...state.logPagination, size});
    };
    watch(() => state.logPagination, async () => {
      await store.dispatch(`${ns}/getLogs`, id.value);
    });

    // page sizes
    const pageSizes = ref<number[]>([
      1000,
      2000,
      5000,
      10000,
      20000,
      50000,
    ]);

    // initialize
    onMounted(async () => {
      if (!editorRef.value) return;

      const editor = monaco.editor.create(editorRef.value, {
        ...fileState.editorOptions,
        readOnly: true,
      });

      resizeObserver.observe(editorRef.value);

      if (content.value) {
        editor.setValue(content.value);
      }

      store.commit(`${ns}/setLogEditor`, editor)
    });

    // dispose
    onUnmounted(() => {
      store.commit(`${ns}/resetLogPagination`);
      if (resizeObserver && editorRef.value) {
        resizeObserver.unobserve(editorRef.value);
      }
      logEditor.value?.dispose();
      store.commit(`${ns}/setLogEditor`, undefined);
    });

    return {
      log: editorRef,
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

<style lang="scss" scoped>
.task-detail-tab-logs {
  height: 100%;

  .pagination {
    text-align: right;
    height: 32px;
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
