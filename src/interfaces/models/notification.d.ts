export declare global {
  type NotificationTriggerTarget = 'task' | 'node' | 'alert';

  type NotificationTrigger =
    | 'task_finish'
    | 'task_error'
    | 'task_empty_results'
    | 'node_status_change'
    | 'node_online'
    | 'node_offline'
    | 'alert';

  interface NotificationSetting extends BaseModel {
    name?: string;
    description?: string;
    enabled?: boolean;
    title?: string;
    template?: string; // legacy template content
    template_mode?: NotificationTemplateMode;
    template_markdown?: string;
    template_rich_text?: string;
    template_rich_text_json?: string;
    template_theme?: string;
    task_trigger?: string;
    trigger?: NotificationTrigger;
    has_mail?: boolean;
    sender_email?: string;
    use_custom_sender_email?: boolean;
    sender_name?: string;
    mail_to?: string[];
    mail_cc?: string[];
    mail_bcc?: string[];
    channel_ids?: string[];
    channels?: NotificationChannel[];
    alert_id?: string;

    // for UI
    template_key?: string;
    use_custom_setting?: boolean;
  }

  interface NotificationSettingTemplate extends NotificationSetting {
    key: string;
  }

  type NotificationTemplateMode = 'rich-text' | 'markdown';

  type NotificationVariableCategory =
    | 'task'
    | 'task_stat'
    | 'node'
    | 'spider'
    | 'spider_stat'
    | 'git'
    | 'project'
    | 'schedule'
    | 'user'
    | 'alert'
    | 'metric';

  interface NotificationVariable {
    category: NotificationVariableCategory;
    name: string;
    label?: string;
    icon?: Icon;
  }

  type NotificationChannelType = 'mail' | 'im';

  interface NotificationChannel extends BaseModel {
    type?: NotificationChannelType;
    name?: string;
    description?: string;
    provider?: string;
    smtp_server?: string;
    smtp_port?: number;
    smtp_username?: string;
    smtp_password?: string;
    webhook_url?: string;
    telegram_bot_token?: string;
    telegram_chat_id?: string;
    google_oauth2_json?: string;
  }

  interface NotificationChannelProvider {
    type: NotificationChannelType;
    name: string;
    icon: Icon;
    smtpServer?: string;
    smtpPort?: number;
    webhookEndpoint?: string;
    webhookToken?: string;
    docUrl?: string | (() => string);
    disabled?: boolean;
    locale?: string;
  }

  type NotificationRequestStatus = 'sending' | 'success' | 'error' | 'unknown';

  interface NotificationRequest extends BaseModel {
    status?: NotificationRequestStatus;
    error?: string;
    title?: string;
    content?: string;
    sender_email?: string;
    sender_name?: string;
    mail_to?: string;
    mail_cc?: string;
    mail_bcc?: string;
    setting_id?: string;
    channel_id?: string;
    setting?: NotificationSetting;
    channel?: NotificationChannel;
    test?: boolean;
  }

  type NotificationAlertOperator = 'gt' | 'ge' | 'lt' | 'le';

  type NotificationAlertLevel = 'info' | 'warning' | 'critical';

  interface NotificationAlert extends BaseModel {
    name?: string;
    description?: string;
    enabled?: boolean;
    has_metric_target?: boolean;
    metric_target_id?: string;
    metric_name?: string;
    operator?: NotificationAlertOperator;
    lasting_seconds?: number;
    target_value?: number;
    level?: NotificationAlertLevel;
    template_key?: string;
  }

  interface NotificationAlertTemplate extends NotificationAlert {
    key: string;
  }
}
