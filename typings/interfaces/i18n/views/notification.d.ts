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
  triggers: {
    taskTrigger: string;
    taskTriggerFinish: string;
    taskTriggerError: string;
    taskTriggerEmptyResults: string;
    taskTriggerNever: string;
  };
  tabs: {
    overview: string;
    triggers: string;
    template: string;
  };
}
