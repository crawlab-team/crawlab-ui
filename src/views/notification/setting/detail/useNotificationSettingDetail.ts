import { computed, onBeforeMount, ref } from 'vue';
import useDetail from '@/layouts/content/detail/useDetail';
import useNotificationSetting from '@/components/core/notification/setting/useNotificationSetting';
import { useStore } from 'vuex';

const useNotificationSettingDetail = () => {
  const ns: ListStoreNamespace = 'notificationSetting';
  const store = useStore();

  const { id, form } = useNotificationSetting(store);

  onBeforeMount(async () => {
    await Promise.all([
      store.dispatch(`${ns}/getById`, id.value),
      store.dispatch('notificationChannel/getAllList'),
    ]);
  });

  return {
    ...useDetail(ns),
    form,
  };
};

export default useNotificationSettingDetail;
