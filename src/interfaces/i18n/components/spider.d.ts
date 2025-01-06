interface LComponentsSpider {
  form: {
    name: string;
    project: string;
    command: string;
    param: string;
    defaultMode: string;
    resultsCollection: string;
    selectedTags: string;
    selectedNodes: string;
    description: string;
    priority: string;
    incrementalSync: string;
    autoInstall: string;
    autoInstallDisabled: string;
    git: string;
    gitRootPath: string;
    template: string;
    templateParams: {
      spiderName: string;
      startUrls: string;
      domains: string;
    };
    templateDoc: string;
  };
  actions: {
    files: {
      tooltip: {
        fileEditorActions: string;
        uploadFiles: string;
        fileEditorSettings: string;
        export: string;
        createWithAi: string;
        createWithAiDisabled: string;
      };
    };
    data: {
      tooltip: {
        dataActions: string;
        export: string;
        displayAllFields: string;
        inferDataFieldsTypes: string;
        dedup: {
          enabled: string;
          disabled: string;
          fields: string;
        };
      };
      placeholder: {
        table: string;
      };
    };
  };
  stat: {
    totalTasks: string;
    totalResults: string;
    averageWaitDuration: string;
    averageRuntimeDuration: string;
    averageTotalDuration: string;
  };
  dialog: {
    run: {
      title: string;
    };
  };
  message: {
    success: {
      scheduleTask: string;
    };
  };
  messageBox: {
    confirm: {
      changeDatabase: {
        title: string;
        message: string;
      };
    };
  };
}
