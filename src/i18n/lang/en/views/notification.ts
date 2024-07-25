const notification: LViewsNotification = {
  settings: {
    navActions: {
      new: {
        label: 'New Notification Setting',
        tooltip: 'Create a new notification setting',
      },
      filter: {
        search: {
          placeholder: 'Search notification settings',
        },
      },
    },
    form: {
      name: 'Name',
      description: 'Description',
      enabled: 'Enabled',
      title: 'Title',
      template: 'Template',
      templateContent: 'Template Content',
      triggerTarget: 'Trigger Target',
      trigger: 'Trigger',
      hasMail: 'Has Mail',
      senderEmail: 'Sender Email',
      senderName: 'Sender Name',
      mailTo: 'Mail To',
      mailCc: 'Mail CC',
      mailBcc: 'Mail BCC',
    },
    triggerTargets: {
      task: 'Task',
      node: 'Node',
    },
    triggers: {
      task: {
        finish: 'Trigger when the task finishes',
        error: 'Trigger when the task fails',
        emptyResults: 'Trigger when the task has empty results',
      },
      node: {
        statusChange: 'Trigger when the node status changes',
        online: 'Trigger when the node comes online',
        offline: 'Trigger when the node goes offline',
      },
    },
    warnings: {
      missingMailConfigFields: {
        content:
          'You selected at least one mail channel. You must set required fields in the mail config to send mail notifications.',
        action: 'Go to the mail config',
      },
      emptyChannel: {
        content: 'Please select at least one notification channel.',
      },
      noWarning: {
        content: 'The notification setting is valid.',
      },
    },
    templates: {
      label: 'Select Template',
    },
  },
  channels: {
    navActions: {
      new: {
        label: 'New Notification Channel',
        tooltip: 'Create a new notification channel',
      },
      filter: {
        search: {
          placeholder: 'Search notification channels',
        },
      },
    },
    form: {
      type: 'Type',
      name: 'Name',
      description: 'Description',
      provider: 'Provider',
      smtpServer: 'SMTP Server',
      smtpPort: 'SMTP Port',
      smtpUsername: 'SMTP Username',
      smtpPassword: 'SMTP Password',
      webhookUrl: 'Webhook URL',
      telegramBotToken: 'Telegram Bot Token',
      telegramChatId: 'Telegram Chat ID',
    },
    types: {
      mail: 'Mail',
      im: 'IM',
    },
    providers: {
      gmail: 'Gmail',
      outlook: 'Microsoft Outlook',
      qq: 'QQ Mail',
      '163': '163 Mail',
      icloud: 'iCloud Mail',
      yahoo: 'Yahoo',
      aol: 'AOL',
      zoho: 'Zoho',
      exmail: 'Tencent Exmail',
      wechat_work: 'WeChat Work',
      dingtalk: 'DingTalk',
      lark: 'Lark',
      slack: 'Slack',
      ms_teams: 'Microsoft Teams',
      telegram: 'Telegram',
      discord: 'Discord',
      custom: 'Custom',
    },
    providerDocs: {
      title: 'Provider Configs',
      label: 'Documentation Link',
    },
  },
};

export default notification;
