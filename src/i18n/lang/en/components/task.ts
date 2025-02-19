const task: LComponentsTask = {
  form: {
    spider: 'Spider',
    schedule: 'Schedule',
    node: 'Node',
    status: 'Status',
    command: 'Execute Command',
    param: 'Execute Param',
    mode: 'Mode',
    priority: 'Priority',
    selectedTags: 'Selected Tags',
    selectedNodes: 'Selected Nodes',
    toRunNodes: 'To Run Nodes',
    tooltip: {
      goToSpider: 'Go to Spider',
      goToNode: 'Go to Node',
      taskErrorMessage: 'Task error message',
      cancelTask: 'Cancel task',
      customized: 'Customized',
    },
  },
  actions: {
    data: {
      tooltip: {
        dataActions: 'Data Actions',
        export: 'Export',
        displayAllFields: 'Display All Fields (including hidden fields)',
        inferDataFieldsTypes: 'Infer Data Fields Types',
      },
    },
  },
  status: {
    label: {
      pending: 'Pending',
      assigned: 'Assigned',
      running: 'Running',
      finished: 'Finished',
      error: 'Error',
      cancelled: 'Cancelled',
      abnormal: 'Abnormal',
      unknown: 'Unknown',
    },
    tooltip: {
      pending: 'Task is pending in the queue',
      assigned: 'Task is assigned to a node to run',
      running: 'Task is currently running',
      finished: 'Task finished successfully',
      error: 'Task ended with an error:',
      cancelled: 'Task has been cancelled',
      abnormal: 'Task ended abnormally',
      unknown: 'Unknown task status',
    },
  },
  priority: {
    high: 'High',
    higher: 'Higher',
    medium: 'Medium',
    lower: 'Lower',
    low: 'Low',
  },
  mode: {
    label: {
      randomNode: 'Random Node',
      allNodes: 'All Nodes',
      selectedNodes: 'Selected Nodes',
      selectedTags: 'Selected Tags',
      unknown: 'Unknown',
    },
    tooltip: {
      randomNode: 'Run on a random node',
      allNodes: 'Run on all nodes',
      selectedNodes: 'Run on selected nodes',
      selectedTags: 'Run on nodes with selected tags',
      unknown: 'Unknown task mode',
    },
  },
  results: {
    results: 'Results',
    noResults: 'No Results',
  },
  logs: {
    actions: {
      autoUpdateLogs: 'Auto update logs',
    },
  },
  dialog: {
    create: {
      title: 'Create Task',
    },
  },
};

export default task;
