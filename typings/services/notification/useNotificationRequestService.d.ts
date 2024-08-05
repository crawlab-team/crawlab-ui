import { Store } from 'vuex';

declare const useNotificationRequestService: (
  store: Store<RootStoreState>
) => Services<NotificationRequest>;
export default useNotificationRequestService;
