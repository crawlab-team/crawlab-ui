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
  },
  variables: {
    invalid: 'Invalid Variable',
    task: {
      id: 'ID',
      status: 'Status',
      mode: 'Mode',
      cmd: 'Command',
      param: 'Parameter',
      priority: 'Priority',
      pid: 'Process ID',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      stat: {
        startTs: 'Start Time',
        endTs: 'End Time',
        waitDuration: 'Wait Duration',
        runtimeDuration: 'Runtime Duration',
        totalDuration: 'Total Duration',
        resultCount: 'Result Count',
      },
    },
    node: {
      key: 'Key',
      name: 'Name',
      description: 'Description',
      status: 'Status',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
    },
    spider: {
      name: 'Name',
      mode: 'Mode',
      cmd: 'Command',
      param: 'Parameter',
      priority: 'Priority',
      stat: {
        results: 'Results',
        waitDuration: 'Wait Duration',
        runtimeDuration: 'Runtime Duration',
        totalDuration: 'Total Duration',
        averageWaitDuration: 'Average Wait Duration',
        averageRuntimeDuration: 'Average Runtime Duration',
        averageTotalDuration: 'Average Total Duration',
      },
    },
  },
  channel: {
    label: 'Channel',
    tooltip: 'Notification channels',
  },
};

export default notification;
