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
    type?: string;
    name?: string;
    description?: string;
    enabled?: boolean;
    global?: boolean;
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
}
