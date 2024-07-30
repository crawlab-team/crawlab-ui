import { onBeforeMount } from 'vue';
import useDetail from '@/layouts/content/detail/useDetail';
import useNotificationAlert from '@/components/core/notification/alert/useNotificationAlert';
import { useStore } from 'vuex';
import { setupGetAllList } from '@/utils';

const useNotificationAlertDetail = () => {
  const ns: ListStoreNamespace = 'notificationAlert';
  const store = useStore();

  const { id, form } = useNotificationAlert(store);

  onBeforeMount(async () => {
    await Promise.all([
      store.dispatch(`${ns}/getById`, id.value),
      store.dispatch('notificationAlert/getAllList'),
    ]);
  });

  setupGetAllList(store, ['node']);

  return {
    ...useDetail(ns),
    form,
  };
};

export default useNotificationAlertDetail;
