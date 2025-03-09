export declare global {
  interface LNavActions {
    new: {
      label: string;
      tooltip: string;
    };
    filter: {
      search: {
        placeholder: string;
      };
    };
  }

  interface LCommon {
    control: {
      enabled: string;
      disabled: string;
    };
    actions: {
      view: string;
      edit: string;
      clone: string;
      delete: string;
      run: string;
      add: string;
      bookmark: string;
      restart: string;
      cancel: string;
      forceCancel: string;
      confirm: string;
      copy: string;
      create: string;
      hide: string;
      start: string;
      stop: string;
      clear: string;
      apply: string;
      search: string;
      install: string;
      uninstall: string;
      viewLogs: string;
      viewSpiders: string;
      viewData: string;
      viewFiles: string;
      uploadFiles: string;
      viewTasks: string;
      viewSchedules: string;
      viewChanges: string;
      viewCommits: string;
      viewDatabases: string;
      viewConsole: string;
      viewPages: string;
      viewUsers: string;
      export: string;
      exportData: string;
      configure: string;
      update: string;
      upgrade: string;
      save: string;
      change: string;
      manage: string;
      inferDataFieldsTypes: string;
      unlink: string;
      goto: string;
      selectAll: string;
      viewMail: string;
      viewTemplate: string;
      viewChannels: string;
      viewMonitoring: string;
      viewDependencies: string;
      previewData: string;
      insertBefore: string;
      insertAfter: string;
      rename: string;
      drop: string;
      checkAll: string;
      uncheckAll: string;
      sendTestMessage: string;
      retry: string;
      send: string;
    };
    messageBox: {
      confirm: {
        delete: string;
        restart: string;
        cancel: string;
        forceCancel: string;
        run: string;
        stop: string;
        install: string;
        start: string;
        deleteSelected: string;
        proceed: string;
        create: string;
        continue: string;
      };
    };
    message: {
      success: {
        delete: string;
        restart: string;
        run: string;
        copy: string;
        start: string;
        save: string;
        upload: string;
        install: string;
        uninstall: string;
        startInstall: string;
        startUninstall: string;
        enabled: string;
        disabled: string;
        action: string;
        update: string;
      };
      info: {
        cancel: string;
        forceCancel: string;
        stop: string;
        retry: string;
      };
      error: {
        login: string;
        action: string;
      };
    };
    notification: {
      loggedOut: string;
    };
    tabs: {
      overview: string;
      spiders: string;
      schedules: string;
      tasks: string;
      files: string;
      git: string;
      data: string;
      settings: string;
      logs: string;
      dependencies: string;
      triggers: string;
      template: string;
      remote: string;
      branches: string;
      tags: string;
      references: string;
      changes: string;
      commits: string;
      ignore: string;
      monitoring: string;
      channels: string;
      mail: string;
      databases: string;
      console: string;
      columns: string;
      indexes: string;
      results: string;
      output: string;
    };
    status: {
      unassigned: string;
      unknown: string;
      invalid: string;
      currentlyUnavailable: string;
      unauthorized: string;
      loading: string;
      upgradePro: string;
      alreadyUpToDate: string;
    };
    mode: {
      default: string;
      other: string;
      all: string;
      unlimited: string;
    };
    placeholder: {
      empty: string;
      unrestricted: string;
    };
    select: {
      input: {
        noDataText: string;
      };
    };
    error: {
      common: string;
    };
    order: {
      asc: string;
      desc: string;
    };
    validate: {
      cannotBeEmpty: string;
    };
    boolean: {
      true: string;
      false: string;
    };
    builtin: {
      admin: string;
      rootAdmin: string;
    };
  }
}
