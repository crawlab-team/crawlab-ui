import { useStore } from 'vuex';
import { useDetail } from '@/layouts';
import { setupGetAllList } from '@/utils';

const useNotificationSettingDetail = () => {
  const ns: ListStoreNamespace = 'notificationSetting';
  const store = useStore();

  setupGetAllList(store, ['notificationAlert', 'notificationChannel']);

  return {
    ...useDetail<NotificationSetting>(ns),
  };
};

export default useNotificationSettingDetail;
