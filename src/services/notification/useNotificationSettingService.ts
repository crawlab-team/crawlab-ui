import { Store } from 'vuex';
import { getDefaultService } from '@/utils/service';

const useNotificationSettingService = (
  store: Store<RootStoreState>
): Services<NotificationSetting> => {
  const ns: ListStoreNamespace = 'notificationSetting';

  return {
    ...getDefaultService<NotificationSetting>(ns, store),
  };
};

export default useNotificationSettingService;
