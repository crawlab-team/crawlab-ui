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
      useCustomSenderEmail: {
        label: 'Use Custom Sender Email',
        tooltip:
          'Use a custom sender email address, otherwise use the default sender email address as configured in SMTP settings',
      },
      senderName: 'Sender Name',
      mailTo: 'Mail To',
      mailCc: 'Mail CC',
      mailBcc: 'Mail BCC',
      alert: 'Alert',
      useCustomSetting: {
        label: 'Use Custom Setting',
        tooltip: 'Use a custom setting, otherwise select a template',
      },
    },
    formRules: {
      invalidEmail: 'Please enter a valid email address',
    },
    triggerTargets: {
      task: 'Task',
      node: 'Node',
      alert: 'Monitoring Alert',
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
    actions: {
      createAlert: 'Create Alert',
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
      googleOAuth2Json: 'Google OAuth2 JSON',
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
  requests: {
    navActionsExtra: {
      filter: {
        select: {
          setting: {
            label: 'Setting',
          },
          channel: {
            label: 'Channel',
          },
        },
      },
    },
    form: {
      setting: 'Setting',
      channel: 'Channel',
      status: 'Status',
      error: 'Error Message',
      createdAt: 'Timestamp',
      title: 'Title',
      content: 'Content',
      senderEmail: 'Sender Email',
      senderName: 'Sender Name',
      mailTo: 'Mail To',
      mailCc: 'Mail CC',
      mailBcc: 'Mail BCC',
    },
    detail: {
      title: 'Notification Request Detail',
    },
  },
  alerts: {
    navActions: {
      new: {
        label: 'New Notification Alert',
        tooltip: 'Create a new notification alert',
      },
      filter: {
        search: {
          placeholder: 'Search notification alerts',
        },
      },
    },
    form: {
      name: 'Name',
      description: 'Description',
      enabled: 'Enabled',
      hasMetricTarget: 'Has Metric Target',
      metricTarget: 'Metric Target',
      alertRule: 'Alert Rule',
      metricName: 'Metric Name',
      operator: 'Operator',
      lastingDuration: 'Lasting Duration',
      targetValue: 'Target Value',
      level: 'Level',
    },
    lastingDuration: {
      '1m': '1 Min (Instant)',
      '5m': '5 Min',
      '10m': '10 Min',
      '30m': '30 Min',
      '1h': '1 Hour',
    },
    levels: {
      info: 'Info',
      warning: 'Warning',
      critical: 'Critical',
    },
  },
  message: {
    success: {
      create: {
        alert: 'Notification alert created successfully',
      },
      sendTestMessage: 'Test message sent successfully',
    },
  },
  messageBox: {
    confirm: {
      sendTestMessage: 'Are you sure to send a test message?',
    },
    prompt: {
      sendTestMessage: {
        title: 'Please enter the email address to send the test message to',
        placeholder: 'Email Address',
      },
    },
  },
};

export default notification;
