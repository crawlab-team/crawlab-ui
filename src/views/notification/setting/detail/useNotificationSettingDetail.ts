import { computed, onBeforeMount, ref } from 'vue';
import useDetail from '@/layouts/content/detail/useDetail';
import useNotificationSetting from '@/components/notification/useNotificationSetting';
import { useStore } from 'vuex';

const useNotificationSettingDetail = () => {
  const ns: ListStoreNamespace = 'notificationSetting';
  const store = useStore();

  const { id, form } = useNotificationSetting(store);

  onBeforeMount(async () => {
    await store.dispatch(`${ns}/getById`, id.value);
  });

  return {
    ...useDetail(ns),
    form,
  };
};

export default useNotificationSettingDetail;
