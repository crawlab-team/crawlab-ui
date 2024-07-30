type NotificationAlertStoreModule = BaseModule<
  NotificationAlertStoreState,
  NotificationAlertStoreGetters,
  NotificationAlertStoreMutations,
  NotificationAlertStoreActions
>;

type NotificationAlertStoreState = BaseStoreState<NotificationAlert>;

type NotificationAlertStoreGetters = BaseStoreGetters<NotificationAlert>;

type NotificationAlertStoreMutations = BaseStoreMutations<NotificationAlert>;

type NotificationAlertStoreActions = BaseStoreActions<NotificationAlert>;
