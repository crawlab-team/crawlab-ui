const env: LViewsEnv = {
  deps: {
    navActions: {
      new: {
        label: 'New Dependency',
        tooltip: 'Install a new dependency',
      },
      filter: {
        search: {
          placeholder: 'Search dependencies',
        },
      },
    },
    navActionsExtra: {
      filter: {
        select: {
          lang: {
            label: 'Programming Language',
          },
          nodes: {
            label: 'Nodes',
          },
        },
      },
    },
    repos: {
      actions: {
        search: {
          label: 'Search Dependencies',
          tooltip: 'Search and install dependencies',
        },
      },
      tabs: {
        installed: 'Installed',
        search: {
          pypi: 'PyPI',
          npm: 'NPM',
        },
      },
    },
    settings: {
      form: {
        key: 'Key',
        name: 'Name',
        description: 'Description',
        enabled: 'Enabled',
        cmd: 'Command',
        proxy: 'Proxy',
      },
      lang: {
        python: {
          description: 'Python dependencies',
        },
        node: {
          description: 'Node.js dependencies',
        },
      },
    },
    dependency: {
      form: {
        name: 'Name',
        latestVersion: 'Latest version',
        installedVersion: 'Installed version',
        requiredVersion: 'Required version',
        installedNodes: 'Installed nodes',
        allNodes: 'All nodes',
        selectedNodes: 'Selected nodes',
        upgrade: 'Upgrade',
        mode: 'Mode',
        version: 'Version',
        toInstallNodes: 'Nodes to install',
        toUninstallNodes: 'Nodes to uninstall',
        status: 'Status',
        error: 'Error',
      },
      status: {
        installing: 'Installing',
        installed: 'Installed',
        uninstalling: 'Uninstalling',
        uninstalled: 'Uninstalled',
        error: 'Error',
        abnormal: 'Abnormal',
      },
    },
    task: {
      tasks: 'Tasks',
      form: {
        action: 'Action',
        node: 'Node',
        status: 'Status',
        dependencies: 'Dependencies',
        time: 'Time',
        logs: 'Logs',
      },
    },
    spider: {
      form: {
        name: 'Name',
        dependencyType: 'Dependency type',
        requiredVersion: 'Required version',
        installedVersion: 'Installed version',
        installedNodes: 'Installed nodes',
      },
    },
    common: {
      status: {
        installed: 'Installed',
        installable: 'Installable',
        upgradable: 'Upgradable',
        downgradable: 'Downgradable',
        noDependencyType: 'No dependency type',
      },
      actions: {
        installAndUpgrade: 'Install and upgrade',
        installAndDowngrade: 'Install and downgrade',
        searchDependencies: 'Search dependencies',
      },
    },
  },
};

export default env;
