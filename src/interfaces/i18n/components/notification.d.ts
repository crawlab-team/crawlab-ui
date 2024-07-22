interface LComponentsNotification {
  dialog: {
    insertVariable: {
      title: string;
      form: {
        variableCategory: string;
        variable: string;
      };
      formRules: {
        variableEmpty: string;
      };
    };
  };
  trigger: {
    label: string;
    tooltip: string;
    target: {
      label: string;
      change: {
        label: string;
        note: string;
      };
    };
    targets: {
      task: string;
      node: string;
    };
  };
  template: {
    mode: {
      change: {
        label: string;
        note: string;
      };
    };
    modes: {
      richText: string;
      markdown: string;
    };
  };
  variableCategories: {
    task: string;
    node: string;
    spider: string;
  };
  variables: {
    invalid: string;
    task: {
      id: string;
      status: string;
      mode: string;
      cmd: string;
      param: string;
      priority: string;
      pid: string;
      createdAt: string;
      updatedAt: string;
      stat: {
        startTs: string;
        endTs: string;
        waitDuration: string;
        runtimeDuration: string;
        totalDuration: string;
        resultCount: string;
      };
    };
    node: {
      key: string;
      name: string;
      description: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    spider: {
      name: string;
      mode: string;
      cmd: string;
      param: string;
      priority: string;
      stat: {
        results: string;
        waitDuration: string;
        runtimeDuration: string;
        totalDuration: string;
        averageWaitDuration: string;
        averageRuntimeDuration: string;
        averageTotalDuration: string;
      };
    };
  };
  channel: {
    label: string;
    tooltip: string;
  };
}
