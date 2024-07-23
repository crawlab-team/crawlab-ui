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
    schedule: string;
  };
  variables: {
    invalid: string;
    common: {
      id: string;
      createdAt: string;
      createdBy: string;
      updatedAt: string;
      updatedBy: string;
    };
    task: {
      status: string;
      mode: string;
      cmd: string;
      param: string;
      priority: string;
      error: string;
      pid: string;
    };
    taskStat: {
      startTs: string;
      endTs: string;
      waitDuration: string;
      runtimeDuration: string;
      totalDuration: string;
      resultCount: string;
    };
    node: {
      key: string;
      name: string;
      description: string;
      ip: string;
      mac: string;
      hostname: string;
      isMaster: string;
      status: string;
      enabled: string;
      active: string;
      activeAt: string;
      availableRunners: string;
      maxRunners: string;
    };
    spider: {
      name: string;
      description: string;
      mode: string;
      cmd: string;
      param: string;
      priority: string;
    };
    spiderStat: {
      results: string;
      waitDuration: string;
      runtimeDuration: string;
      totalDuration: string;
      averageWaitDuration: string;
      averageRuntimeDuration: string;
      averageTotalDuration: string;
    };
    schedule: {
      name: string;
      description: string;
      cron: string;
      cmd: string;
      param: string;
      priority: string;
      mode: string;
    };
  };
  channel: {
    label: string;
    tooltip: string;
  };
}
