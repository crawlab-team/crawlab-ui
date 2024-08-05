import { Store } from 'vuex';

declare const useNotificationChannelService: (
  store: Store<RootStoreState>
) => Services<NotificationChannel>;
export default useNotificationChannelService;
