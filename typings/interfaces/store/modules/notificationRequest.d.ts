type NotificationRequestStoreModule = BaseModule<
  NotificationRequestStoreState,
  NotificationRequestStoreGetters,
  NotificationRequestStoreMutations,
  NotificationRequestStoreActions
>;

type NotificationRequestStoreState = BaseStoreState<NotificationRequest>;

type NotificationRequestStoreGetters = BaseStoreGetters<NotificationRequest>;

type NotificationRequestStoreMutations =
  BaseStoreMutations<NotificationRequest>;

type NotificationRequestStoreActions = BaseStoreActions<NotificationRequest>;
