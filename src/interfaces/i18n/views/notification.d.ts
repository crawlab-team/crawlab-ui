interface LViewsNotification {
  settings: {
    navActions: LNavActions;
    form: {
      name: string;
      description: string;
      enabled: string;
      title: string;
      template: string;
      templateContent: string;
      triggerTarget: string;
      trigger: string;
      hasMail: string;
      senderEmail: string;
      useCustomSenderEmail: {
        label: string;
        tooltip: string;
      };
      senderName: string;
      mailTo: string;
      mailCc: string;
      mailBcc: string;
      alert: string;
      useCustomSetting: {
        label: string;
        tooltip: string;
      };
    };
    formRules: {
      invalidEmail: string;
    };
    triggerTargets: {
      task: string;
      node: string;
      alert: string;
    };
    triggers: {
      task: {
        finish: string;
        error: string;
        emptyResults: string;
      };
      node: {
        statusChange: string;
        online: string;
        offline: string;
      };
    };
    warnings: {
      missingMailConfigFields: {
        content: string;
        action: string;
      };
      emptyChannel: {
        content: string;
      };
      noWarning: {
        content: string;
      };
    };
    templates: {
      label: string;
    };
    actions: {
      createAlert: string;
    };
  };
  channels: {
    navActions: LNavActions;
    form: {
      type: string;
      name: string;
      description: string;
      provider: string;
      smtpServer: string;
      smtpPort: string;
      smtpUsername: string;
      smtpPassword: string;
      webhookUrl: string;
      telegramBotToken: string;
      telegramChatId: string;
      googleOAuth2Json: string;
    };
    types: {
      mail: string;
      im: string;
    };
    providers: {
      gmail: string;
      outlook: string;
      qq: string;
      163: string;
      icloud: string;
      yahoo: string;
      aol: string;
      zoho: string;
      wechat_work: string;
      dingtalk: string;
      lark: string;
      slack: string;
      ms_teams: string;
      telegram: string;
      discord: string;
      custom: string;
    };
    providerDocs: {
      title: string;
      label: string;
    };
  };
  requests: {
    navActionsExtra: {
      filter: {
        select: {
          setting: {
            label: string;
          };
          channel: {
            label: string;
          };
        };
      };
    };
    form: {
      setting: string;
      channel: string;
      status: string;
      error: string;
      createdAt: string;
      title: string;
      content: string;
      senderEmail: string;
      senderName: string;
      mailTo: string;
      mailCc: string;
      mailBcc: string;
    };
    detail: {
      title: string;
    };
  };
  alerts: {
    navActions: LNavActions;
    form: {
      name: string;
      description: string;
      enabled: string;
      hasMetricTarget: string;
      metricTarget: string;
      alertRule: string;
      metricName: string;
      operator: string;
      lastingDuration: string;
      targetValue: string;
      level: string;
    };
    lastingDuration: {
      '1m': string;
      '5m': string;
      '10m': string;
      '30m': string;
      '1h': string;
    };
    levels: {
      info: string;
      warning: string;
      critical: string;
    };
  };
  message: {
    success: {
      create: {
        alert: string;
      };
      sendTestMessage: string;
    };
  };
  messageBox: {
    confirm: {
      sendTestMessage: string;
    };
    prompt: {
      sendTestMessage: {
        title: string;
        placeholder: string;
      };
    };
  };
}
