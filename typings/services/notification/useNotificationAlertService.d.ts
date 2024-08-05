import { Store } from 'vuex';

declare const useNotificationAlertService: (
  store: Store<RootStoreState>
) => Services<NotificationAlert>;
export default useNotificationAlertService;
