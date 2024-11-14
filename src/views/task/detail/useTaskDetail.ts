import { onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useDetail } from '@/layouts';
import { setupGetAllList } from '@/utils/list';

const useTaskDetail = () => {
  // store
  const ns = 'task';
  const store = useStore();

  // dispose
  onBeforeUnmount(() => {
    store.commit(`${ns}/resetLogContent`);
    store.commit(`${ns}/resetLogPagination`);
    store.commit(`${ns}/resetLogTotal`);
    store.commit(`${ns}/disableLogAutoUpdate`);
  });

  setupGetAllList(store, ['node', 'spider']);

  return {
    ...useDetail<Task>('task'),
  };
};

export default useTaskDetail;
