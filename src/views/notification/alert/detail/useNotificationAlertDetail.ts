import { useStore } from 'vuex';
import { useDetail } from '@/layouts';
import { setupGetAllList } from '@/utils';

const useNotificationAlertDetail = () => {
  const ns: ListStoreNamespace = 'notificationAlert';
  const store = useStore();

  setupGetAllList(store, ['node']);

  return {
    ...useDetail<NotificationAlert>(ns),
  };
};

export default useNotificationAlertDetail;
