interface SettingTemplate {
  label: string;
  name: string;
  description: string;
  title: string;
  template_markdown?: string;
  template_rich_text?: string;
}

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
    alert: string;
    metric: string;
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
      enabled: string;
    };
    alert: {
      name: string;
      description: string;
      enabled: string;
      metricName: string;
      operator: string;
      lastingDuration: string;
      targetValue: string;
      level: string;
    };
  };
  channel: {
    label: string;
    tooltip: string;
  };
  setting: {
    templates: {
      task_finish: SettingTemplate;
      task_error: SettingTemplate;
      node_status_change: SettingTemplate;
      node_offline: SettingTemplate;
      alert_cpu_critical: SettingTemplate;
      // alert_cpu_warning: SettingTemplate;
      // alert_memory_critical: SettingTemplate;
      alert_memory_warning: SettingTemplate;
      // alert_disk_critical: SettingTemplate;
      // alert_disk_warning: SettingTemplate;
    };
  };
  request: {
    status: {
      label: {
        sending: string;
        success: string;
        error: string;
        unknown: string;
      };
      tooltip: {
        sending: string;
        success: string;
        error: string;
        unknown: string;
      };
    };
    test: {
      label: string;
      tooltip: string;
    };
  };
}
