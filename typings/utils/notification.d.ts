export declare const allVariables: NotificationVariable[];
export declare const getTriggerTarget: (
  trigger?: NotificationTrigger
) => NotificationTriggerTarget | undefined;
export declare const triggerTargetVariableCategoryMap: Record<
  NotificationTriggerTarget,
  NotificationVariableCategory[]
>;
export declare const isValidVariable: ({
  category,
  name,
}: {
  category?: NotificationVariableCategory;
  name: string;
}) => boolean;
export declare const allTemplates: NotificationSettingTemplate[];
export declare const alertTemplates: NotificationAlertTemplate[];
export declare const getTriggerOptions: () => SelectOption<string>[];
export declare const hasNotificationSettingMailChannel: (
  form: NotificationSetting,
  allChannelDict: Map<string, NotificationChannel>
) => boolean | undefined;
export declare const hasNotificationSettingChannelWarningMissingMailConfigFields: (
  form: NotificationSetting,
  allChannelDict: Map<string, NotificationChannel>
) => boolean;
