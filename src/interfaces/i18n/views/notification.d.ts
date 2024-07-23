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
      senderName: string;
      mailTo: string;
      mailCc: string;
      mailBcc: string;
    };
    triggerTargets: {
      task: string;
      node: string;
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
      exmail: string;
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
}
