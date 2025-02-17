const spider: LComponentsSpider = {
  form: {
    name: 'Name',
    project: 'Project',
    command: 'Execute Command',
    param: 'Parameters',
    defaultMode: 'Default Mode',
    resultsCollection: 'Results Collection',
    selectedTags: 'Selected Tags',
    selectedNodes: 'Selected Nodes',
    description: 'Description',
    priority: 'Priority',
    incrementalSync: 'Incremental Sync',
    autoInstall: 'Auto Install',
    autoInstallDisabled: 'Auto Install (available in Crawlab Pro)',
    git: 'Git Repo',
    gitRootPath: 'Git Path',
    template: 'Template',
    templateParams: {
      spiderName: 'Spider Name',
      startUrls: 'Start URLs',
      domains: 'Domains',
    },
    templateDoc: 'Template Docs',
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
        displayAllFields: 'Display All Fields (including hidden fields)',
        inferDataFieldsTypes: 'Infer Data Fields Types',
        dedup: {
          enabled: 'Deduplication is enabled',
          disabled: 'Deduplication id disabled',
          fields: 'Configure Deduplication Fields',
        },
      },
      placeholder: {
        table: 'Please select table',
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
  messageBox: {
    confirm: {
      changeDatabase: {
        title: 'Change Database',
        message:
          'Are you sure you want to change the database? The change may result in issues when viewing or saving data with the spider.',
      },
    },
  },
};

export default spider;
