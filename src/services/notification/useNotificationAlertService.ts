import { Store } from 'vuex';
import { getDefaultService } from '@/utils/service';

const useNotificationAlertService = (
  store: Store<RootStoreState>
): Services<NotificationAlert> => {
  const ns: ListStoreNamespace = 'notificationAlert';

  return {
    ...getDefaultService<NotificationAlert>(ns, store),
  };
};

export default useNotificationAlertService;
