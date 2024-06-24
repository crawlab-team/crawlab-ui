import { useStore } from 'vuex';
import useDetail from '@/layouts/content/detail/useDetail';
import { setupGetAllList } from '@/utils/list';
import useTask from '@/components/task/useTask';
import { onBeforeUnmount } from 'vue';

const useTaskDetail = () => {
  // store
  const ns = 'task';
  const store = useStore();

  const { form } = useTask(store);

  // dispose
  onBeforeUnmount(() => {
    store.commit(`${ns}/resetLogContent`);
    store.commit(`${ns}/resetLogPagination`);
    store.commit(`${ns}/resetLogTotal`);
    store.commit(`${ns}/disableLogAutoUpdate`);
  });

  setupGetAllList(store, ['node', 'spider']);

  return {
    ...useDetail('task'),
    form,
  };
};

export default useTaskDetail;
