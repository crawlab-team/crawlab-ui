const spider: LComponentsSpider = {
  form: {
    name: 'Name',
    project: 'Project',
    command: 'Execute Command',
    param: 'Param',
    defaultMode: 'Default Mode',
    resultsCollection: 'Results Collection',
    selectedTags: 'Selected Tags',
    selectedNodes: 'Selected Nodes',
    description: 'Description',
    priority: 'Priority',
    incrementalSync: 'Incremental Sync',
    autoInstall: 'Auto Install',
    autoInstallDisabled: 'Auto Install (available in Crawlab Pro)',
  },
  actions: {
    files: {
      tooltip: {
        fileEditorActions: 'File Editor Actions',
        uploadFiles: 'Upload Files',
        fileEditorSettings: 'File Editor Settings',
        export: 'Export Files',
        createWithAi: 'Create with AI',
        createWithAiDisabled: 'Create with AI (available in Crawlab Pro)',
      },
    },
    data: {
      tooltip: {
        dataActions: 'Data Actions',
        export: 'Export',
        displayAllFields: 'Display All Fields',
        inferDataFieldsTypes: 'Infer Data Fields Types',
        dedup: {
          enabled: 'Deduplication is enabled',
          disabled: 'Deduplication id disabled',
          fields: 'Configure Deduplication Fields',
        },
      },
    },
  },
  stat: {
    totalTasks: 'Total Tasks',
    totalResults: 'Total Results',
    averageWaitDuration: 'Average Wait Duration',
    averageRuntimeDuration: 'Average Runtime Duration',
    averageTotalDuration: 'Average Total Duration',
  },
  dialog: {
    run: {
      title: 'Run Spider',
    },
  },
  message: {
    success: {
      scheduleTask: 'Scheduled task successfully',
    },
  },
};

export default spider;
