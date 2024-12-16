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
    label: 'Dependency',
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
          go: 'pkg.go.dev',
          maven: 'Maven',
          chromium: 'Chromium',
        },
        nodes: 'Nodes',
      },
    },
    lang: {
      python: 'Python',
      node: 'Node.js',
      go: 'Go',
      java: 'Java',
      browser: 'Browser',
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
    config: {
      form: {
        name: 'Name',
        execCmd: 'Execute Command',
        pkgCmd: 'Package Command',
        proxy: 'Proxy',
      },
    },
    configSetup: {
      form: {
        status: 'Status',
        version: 'Version',
        error: 'Error',
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
