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
    alert: 'Alert',
    metric: 'Metric',
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
      name: 'Name',
      description: 'Description',
      cron: 'Cron',
      cmd: 'Command',
      param: 'Parameter',
      priority: 'Priority',
      mode: 'Mode',
      enabled: 'Enabled',
    },
    alert: {
      name: 'Name',
      description: 'Description',
      enabled: 'Enabled',
      metricName: 'Metric Name',
      operator: 'Operator',
      lastingDuration: 'Lasting Duration',
      targetValue: 'Target Value',
      level: 'Level',
    },
  },
  channel: {
    label: 'Channel',
    tooltip: 'Notification channels',
  },
  setting: {
    templates: {
      task_finish: {
        label: 'Task Finish',
        name: 'Task Finish',
        description: 'Task finish notification template',
        title: 'Task Finish',
        template_markdown: `- Spider Name: \${spider:name}
- Schedule Name: \${schedule:name}
- Node Name: \${node:name}
- Task ID: \${task:id}
- Task Status: \${task:status}
- Task Error: \${task:error}
- Task Mode: \${task:mode}
- Task Command: \${task:cmd}
- Task Parameter: \${task:param}
- Task Priority: \${task:priority}
- Task Created By: \${task:created_by}
- Task Created At: \${task:created_ts}
- Task Started At: \${task_stat:start_ts}
- Task Ended At: \${task_stat:ended_ts}
- Task Wait Duration: \${task_stat:wait_duration}
- Task Runtime Duration: \${task_stat:runtime_duration}
- Task Total Duration: \${task_stat:total_duration}
- Task Result Count: \${task_stat:result_count}`,
      },
      task_error: {
        label: 'Task Error',
        name: 'Task Error',
        description: 'Task error notification template',
        title: 'Task Error',
        template_markdown: `- Spider Name: \${spider:name}
- Schedule Name: \${schedule:name}
- Node Name: \${node:name}
- Task ID: \${task:id}
- Task Status: \${task:status}
- Task Error: \${task:error}
- Task Mode: \${task:mode}
- Task Command: \${task:cmd}
- Task Parameter: \${task:param}
- Task Priority: \${task:priority}
- Task Created By: \${task:created_by}
- Task Created At: \${task:created_ts}
- Task Started At: \${task_stat:start_ts}
- Task Ended At: \${task_stat:end_ts}
- Task Wait Duration: \${task_stat:wait_duration}
- Task Runtime Duration: \${task_stat:runtime_duration}
- Task Total Duration: \${task_stat:total_duration}
- Task Result Count: \${task_stat:result_count}`,
      },
      node_status_change: {
        label: 'Node Status Change',
        name: 'Node Status Change',
        description: 'Node status change notification template',
        title: 'Node Status Change',
        template_markdown: `- Node Name: \${node:name}
- Node Status: \${node:status}
- Node Is Master: \${node:is_master}
- Node IP Address: \${node:ip}
- Node MAC Address: \${node:mac}
- Node Hostname: \${node:hostname}
- Node Enabled: \${node:enabled}
- Node Active: \${node:active}
- Node Active At: \${node:active_at}
- Node Current Runners: \${node:current_runners}
- Node Max Runners: \${node:max_runners}`,
      },
      node_offline: {
        label: 'Node Offline',
        name: 'Node Offline',
        description: 'Node offline notification template',
        title: 'Node Offline',
        template_markdown: `The node \${node:name} is offline. Please check the node status.

- Node Name: \${node:name}
- Node Status: \${node:status}
- Node Is Master: \${node:is_master}
- Node IP Address: \${node:ip}
- Node MAC Address: \${node:mac}
- Node Hostname: \${node:hostname}
- Node Enabled: \${node:enabled}
- Node Active: \${node:active}
- Node Active At: \${node:active_at}
- Node Current Runners: \${node:current_runners}
- Node Max Runners: \${node:max_runners}`,
      },
      alert_cpu_critical: {
        label: 'CPU Critical',
        name: 'CPU Critical',
        description: 'CPU critical alert notification',
        title: 'CPU Usage Critical (> 90%)',
        template_markdown: `CPU usage is critical. Please check.

- Alert Name: \${alert:name}
- Alert Level: \${alert:level}
- Alert Threshold: \${alert:target_value}
- Current CPU Usage: \${metric:cpu_usage_percent}
- Node: \${node:name}
`,
      },
      alert_memory_warning: {
        label: 'Memory Warning',
        name: 'Memory Warning',
        description: 'Memory critical alert notification',
        title: 'Memory Usage Warning (> 40%)',
        template_markdown: `Memory usage is high. Please check.

- Alert Name: \${alert:name}
- Alert Level: \${alert:level}
- Alert Threshold: \${alert:target_value}
- Current Memory Usage: \${metric:used_memory_percent} (\${metric:used_memory} / \${metric:total_memory})
- Node: \${node:name}
- Node Is Master: \${node:is_master}
`,
      },
    },
  },
  request: {
    status: {
      label: {
        sending: 'Sending',
        success: 'Success',
        error: 'Error',
        unknown: 'Unknown',
      },
      tooltip: {
        sending: 'Sending notification request',
        success: 'Notification request sent successfully',
        error: 'Failed to send notification request',
        unknown: 'Unknown notification request status',
      },
    },
    test: {
      label: 'Test Notification',
      tooltip: 'This is a test notification',
    },
  },
};

export default notification;
