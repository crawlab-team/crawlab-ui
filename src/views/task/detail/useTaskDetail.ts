import {useStore} from 'vuex';
import useDetail from '@/layouts/content/detail/useDetail';
import {setupGetAllList} from '@/utils/list';
import useTask from '@/components/task/task';
import {computed, onBeforeMount, onBeforeUnmount} from 'vue';
import {isCancellable} from '@/utils/task';
import * as monaco from 'monaco-editor';

const useTaskDetail = () => {
  // store
  const ns = 'task';
  const store = useStore();
  const {
    task: state,
  } = store.state as RootStoreState;

  const {
    activeId,
  } = useDetail('task');

  const {
    form,
  } = useTask(store);

  // editor
  const logEditor = computed<monaco.editor.IStandaloneCodeEditor | undefined>(() => state.logEditor);

  const updateLogs = async () => {
    // skip if active id is empty
    if (!activeId.value) return;

    // update logs
    await store.dispatch(`${ns}/getLogs`, activeId.value);

    // update pagination
    const {logPagination, logTotal} = state;
    const {page, size} = logPagination;
    if (logTotal > size * page) {
      const maxPage = Math.ceil(logTotal / size);
      store.commit(`${ns}/setLogPagination`, {
        page: maxPage,
        size,
      });
    }

    // scroll to bottom
    setTimeout(() => {
      const model = logEditor.value?.getModel();
      logEditor.value?.revealLine(model?.getLineCount() || 0);
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
  onBeforeUnmount(() => {
    store.commit(`${ns}/resetLogContent`);
    store.commit(`${ns}/resetLogPagination`);
    store.commit(`${ns}/resetLogTotal`);
    store.commit(`${ns}/disableLogAutoUpdate`);
  });

  setupGetAllList(store, [
    'node',
    'spider',
  ]);

  return {
    ...useDetail('task'),
    logEditor,
  };
};

export default useTaskDetail;
