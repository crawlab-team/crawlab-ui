import { Store } from 'vuex';
import { getDefaultService } from '@/utils/service';

const useNotificationRequestService = (
  store: Store<RootStoreState>
): Services<NotificationRequest> => {
  const ns: ListStoreNamespace = 'notificationRequest';

  return {
    ...getDefaultService<NotificationRequest>(ns, store),
  };
};

export default useNotificationRequestService;
