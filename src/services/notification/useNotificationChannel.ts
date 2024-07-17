import { Store } from 'vuex';
import { getDefaultService } from '@/utils/service';

const useNotificationChannelService = (
  store: Store<RootStoreState>
): Services<NotificationChannel> => {
  const ns: ListStoreNamespace = 'notificationChannel';

  return {
    ...getDefaultService<NotificationChannel>(ns, store),
  };
};

export default useNotificationChannelService;
