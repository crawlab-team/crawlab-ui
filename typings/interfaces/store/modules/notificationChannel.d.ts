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

interface NotificationChannelStoreActions
  extends BaseStoreActions<NotificationChannel> {
  sendTestMessage: StoreAction<
    NotificationChannelStoreState,
    { id: string; toMail?: string }
  >;
}
