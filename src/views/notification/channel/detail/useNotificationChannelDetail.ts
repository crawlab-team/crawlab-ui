import { useStore } from 'vuex';
import { setupGetAllList } from '@/utils';
import { useDetail } from '@/layouts';

const useNotificationChannelDetail = () => {
  const ns: ListStoreNamespace = 'notificationChannel';
  const store = useStore();

  setupGetAllList(store, ['node', 'notificationChannel']);

  return {
    ...useDetail<NotificationChannel>(ns),
  };
};

export default useNotificationChannelDetail;
