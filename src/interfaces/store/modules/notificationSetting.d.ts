type NotificationSettingStoreModule = BaseModule<
  NotificationSettingStoreState,
  NotificationSettingStoreGetters,
  NotificationSettingStoreMutations,
  NotificationSettingStoreActions
>;

type NotificationSettingStoreState = BaseStoreState<NotificationSetting>;

type NotificationSettingStoreGetters = BaseStoreGetters<NotificationSetting>;

interface NotificationSettingStoreMutations
  extends BaseStoreMutations<NotificationSetting> {
  setTemplateTitle: StoreMutation<NotificationSettingStoreState, string>;
  resetTemplateTitle: StoreMutation<NotificationSettingStoreState>;
  setTemplateContent: StoreMutation<NotificationSettingStoreState, string>;
  resetTemplateContent: StoreMutation<NotificationSettingStoreState>;
}

type NotificationSettingStoreActions = BaseStoreActions<NotificationSetting>;
