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
    label: string;
    repos: {
      actions: {
        search: {
          label: string;
          tooltip: string;
        };
        searchNotReady: {
          label: string;
          tooltip: string;
          python: {
            title: string;
            content: string;
          };
        };
        installEnvironments: {
          label: string;
          tooltip: string;
        };
      };
      tabs: {
        installed: string;
        search: {
          pypi: string;
          npm: string;
          go: string;
          maven: string;
          chromium: string;
        };
        nodes: string;
      };
      empty: {
        configNotSetup: {
          title: string;
          content: string;
          action: {
            label: string;
            tooltip: string;
          };
        };
        java: {
          title: string;
          content: string;
          action: {
            label: string;
            tooltip: string;
          };
        };
      };
    };
    lang: {
      python: string;
      node: string;
      go: string;
      java: string;
      browser: string;
    };
    dependency: {
      form: {
        name: string;
        latestVersion: string;
        installedVersion: string;
        requiredVersion: string;
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
    config: {
      form: {
        name: string;
        execCmd: string;
        pkgCmd: string;
        pkgSrcURL: string;
        defaultVersion: string;
      };
      alert: {
        browser: {
          nodeSetupRequired: {
            content: string;
            action: string;
          };
        };
      };
    };
    configSetup: {
      form: {
        status: string;
        version: string;
        error: string;
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
