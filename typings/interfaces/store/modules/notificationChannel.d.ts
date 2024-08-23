type NotificationChannelStoreModule = BaseModule<
  NotificationChannelStoreState,
  NotificationChannelStoreGetters,
  NotificationChannelStoreMutations,
  NotificationChannelStoreActions
>;

type NotificationChannelStoreState = BaseStoreState<NotificationChannel>;

type NotificationChannelStoreGetters = BaseStoreGetters<NotificationChannel>;

type NotificationChannelStoreMutations =
  BaseStoreMutations<NotificationChannel>;

type NotificationChannelStoreActions = BaseStoreActions<NotificationChannel>;
