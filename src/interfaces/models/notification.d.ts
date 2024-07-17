export declare global {
  type NotificationTriggerTarget = 'task' | 'node';

  type NotificationTrigger =
    | 'task_finish'
    | 'task_error'
    | 'task_empty_results'
    | 'task_never'
    | 'node_status_change'
    | 'node_online'
    | 'node_offline'
    | 'node_never';

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
    trigger_target?: NotificationTriggerTarget;
    trigger?: NotificationTrigger;
    channel_ids?: string[];
    channels?: NotificationChannel[];
  }

  type NotificationTemplateMode = 'rich-text' | 'markdown';

  type NotificationVariableCategory =
    | 'task'
    | 'node'
    | 'spider'
    | 'git'
    | 'project'
    | 'schedule'
    | 'user';

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
    mail_settings?: {
      smtp_server?: string;
      smtp_port?: string;
      smtp_from_email_address?: string;
      smtp_from_email_password?: string;
    };
    im_settings?: {
      webhook?: string;
    };
  }
}
