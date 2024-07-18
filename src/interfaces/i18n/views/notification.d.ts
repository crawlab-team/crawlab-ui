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
      hasMail: boolean;
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
        never: string;
      };
      node: {
        statusChange: string;
        online: string;
        offline: string;
        never: string;
      };
    };
    tabs: {
      overview: string;
      triggers: string;
      template: string;
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
      hotmail: string;
      aol: string;
      zoho: string;
      yandex: string;
      126: string;
      sina: string;
      sohu: string;
      tencent: string;
      wechat_work: string;
      dingtalk: string;
      lark: string;
      slack: string;
      ms_teams: string;
      telegram: string;
      discord: string;
      whatsapp_business: string;
      facebook_messenger: string;
    };
  };
}
