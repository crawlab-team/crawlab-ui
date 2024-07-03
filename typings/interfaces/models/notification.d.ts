export declare global {
  interface NotificationSetting extends BaseModel {
    type?: string;
    name?: string;
    description?: string;
    enabled?: boolean;
    global?: boolean;
    title?: string;
    template?: string;
    task_trigger?: string;
    mail?: NotificationSettingMail;
    mobile?: NotificationSettingMobile;
  }

  interface NotificationSettingMail {
    server?: string;
    port?: string;
    user?: string;
    password?: string;
    sender_email?: string;
    sender_identity?: string;
    to?: string;
    cc?: string;
  }

  interface NotificationSettingMobile {
    webhook?: string;
  }
}
