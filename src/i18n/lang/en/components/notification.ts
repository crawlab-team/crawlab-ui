const notification: LComponentsNotification = {
  dialog: {
    insertVariable: {
      title: 'Insert Variable',
      form: {
        variableCategory: 'Variable Category',
        variable: 'Variable',
      },
      formRules: {
        variableEmpty: 'Please select a variable',
      },
    },
  },
  trigger: {
    label: 'Trigger',
    tooltip: 'Notification trigger settings',
    target: {
      label: 'Trigger Target',
      change: {
        label: 'Change Trigger Target',
        note: 'Note: Changing the trigger target may cause variables unavailable in the template',
      },
    },
    targets: {
      task: 'Task',
      node: 'Node',
    },
  },
  template: {
    mode: {
      change: {
        label: 'Change Edit Mode',
        note: 'Note: Changing the edit mode may cause style or content loss',
      },
    },
    modes: {
      richText: 'Rich Text',
      markdown: 'Markdown',
    },
  },
  variableCategories: {
    task: 'Task',
    node: 'Node',
    spider: 'Spider',
    schedule: 'Schedule',
  },
  variables: {
    invalid: 'Invalid Variable',
    common: {
      id: 'ID',
      createdAt: 'Created At',
      createdBy: 'Created By',
      updatedAt: 'Updated At',
      updatedBy: 'Updated By',
    },
    task: {
      status: 'Status',
      mode: 'Mode',
      cmd: 'Command',
      param: 'Parameter',
      priority: 'Priority',
      error: 'Error Message',
      pid: 'Process ID',
    },
    taskStat: {
      startTs: 'Start Time',
      endTs: 'End Time',
      waitDuration: 'Wait Duration (sec)',
      runtimeDuration: 'Runtime Duration (sec)',
      totalDuration: 'Total Duration (sec)',
      resultCount: 'Result Count',
    },
    node: {
      key: 'Key',
      name: 'Name',
      description: 'Description',
      ip: 'IP Address',
      mac: 'MAC Address',
      hostname: 'Hostname',
      isMaster: 'Is Master',
      status: 'Status',
      enabled: 'Enabled',
      active: 'Active',
      activeAt: 'Active At',
      availableRunners: 'Available Runners',
      maxRunners: 'Max Runners',
    },
    spider: {
      name: 'Name',
      description: 'Description',
      mode: 'Mode',
      cmd: 'Command',
      param: 'Parameter',
      priority: 'Priority',
    },
    spiderStat: {
      results: 'Results',
      waitDuration: 'Wait Duration (sec)',
      runtimeDuration: 'Runtime Duration (sec)',
      totalDuration: 'Total Duration (sec)',
      averageWaitDuration: 'Average Wait Duration (sec)',
      averageRuntimeDuration: 'Average Runtime Duration (sec)',
      averageTotalDuration: 'Average Total Duration (sec)',
    },
    schedule: {
      id: 'ID',
      name: 'Name',
      description: 'Description',
      cron: 'Cron',
      cmd: 'Command',
      param: 'Parameter',
      priority: 'Priority',
      mode: 'Mode',
      enabled: 'Enabled',
    },
  },
  channel: {
    label: 'Channel',
    tooltip: 'Notification channels',
  },
};

export default notification;
