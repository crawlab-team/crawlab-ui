interface LViewsEnv {
  deps: {
    navActions: LNavActions;
    navActionsExtra: {
      filter: {
        select: {
          lang: {
            label: string;
          };
          nodes: {
            label: string;
          };
        };
      };
    };
    repos: {
      actions: {
        search: {
          label: string;
          tooltip: string;
        };
      };
      tabs: {
        installed: string;
        search: {
          pypi: string;
          npm: string;
        };
      };
    };
    settings: {
      form: {
        key: string;
        name: string;
        description: string;
        enabled: string;
        cmd: string;
        proxy: string;
      };
      lang: {
        python: {
          description: string;
        };
        node: {
          description: string;
        };
      };
    };
    dependency: {
      form: {
        name: string;
        latestVersion: string;
        installedVersion: string;
        installedNodes: string;
        allNodes: string;
        selectedNodes: string;
        upgrade: string;
        mode: string;
        version: string;
        toInstallNodes: string;
        toUninstallNodes: string;
        status: string;
        error: string;
      };
      status: {
        installing: string;
        installed: string;
        uninstalled: string;
        uninstalling: string;
        error: string;
        abnormal: string;
      };
    };
    task: {
      tasks: string;
      form: {
        action: string;
        node: string;
        status: string;
        dependencies: string;
        time: string;
        logs: string;
      };
    };
    spider: {
      form: {
        name: string;
        dependencyType: string;
        requiredVersion: string;
        installedVersion: string;
        installedNodes: string;
      };
    };
    common: {
      status: {
        installed: string;
        installable: string;
        upgradable: string;
        downgradable: string;
        noDependencyType: string;
      };
      actions: {
        installAndUpgrade: string;
        installAndDowngrade: string;
        searchDependencies: string;
      };
    };
  };
}
