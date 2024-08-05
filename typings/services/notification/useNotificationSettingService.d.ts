import { Store } from 'vuex';

declare const useNotificationSettingService: (
  store: Store<RootStoreState>
) => Services<NotificationSetting>;
export default useNotificationSettingService;
