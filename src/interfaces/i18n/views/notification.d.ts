interface LViewsNotification {
  navActions: LNavActions;
  settings: {
    form: {
      name: string;
      description: string;
      type: string;
      enabled: string;
      title: string;
      template: string;
      templateContent: string;
      triggerTarget: string;
      trigger: string;
      mail: {
        smtp: {
          server: string;
          port: string;
          user: string;
          password: string;
          sender: {
            email: string;
            identity: string;
          };
        };
        to: string;
        cc: string;
      };
      mobile: {
        webhook: string;
      };
    };
    type: {
      mail: string;
      mobile: string;
    };
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
}
