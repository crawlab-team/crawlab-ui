const env: LViewsEnv = {
  deps: {
    navActions: {
      new: {
        label: '安装依赖',
        tooltip: '安装新依赖',
      },
      filter: {
        search: {
          placeholder: '搜索依赖',
        },
      },
    },
    navActionsExtra: {
      filter: {
        select: {
          lang: {
            label: '编程语言',
          },
          nodes: {
            label: '节点',
          },
        },
      },
    },
    label: '依赖',
    repos: {
      actions: {
        search: {
          label: '搜索依赖',
          tooltip: '搜索并安装依赖',
        },
      },
      tabs: {
        installed: '已安装',
        search: {
          pypi: 'PyPI',
          npm: 'NPM',
          go: 'pkg.go.dev',
          maven: 'Maven',
          chromium: 'Chromium',
        },
        nodes: '节点',
      },
      empty: {
        configNotSetup: {
          title: '依赖环境未安装',
          content: '请先安装依赖环境（或编程语言）',
          action: {
            label: '立即安装',
            tooltip: '安装依赖环境（或编程语言）',
          },
        },
        java: {
          title: '不支持全局依赖',
          content: 'Java（Maven）不支持全局依赖的安装/卸载。请在爬虫内管理。',
          action: {
            label: '在爬虫内管理',
            tooltip: '在爬虫内的依赖选项卡中管理',
          },
        },
      },
    },
    lang: {
      python: 'Python',
      node: 'Node.js',
      go: 'Go',
      java: 'Java',
      browser: '浏览器',
    },
    dependency: {
      form: {
        name: '名称',
        latestVersion: '最新版本',
        installedVersion: '已安装版本',
        requiredVersion: '所需版本',
        installedNodes: '已安装节点',
        allNodes: '所有节点',
        selectedNodes: '指定节点',
        upgrade: '是否升级',
        mode: '模式',
        version: '版本',
        toInstallNodes: '待安装节点',
        toUninstallNodes: '待卸载节点',
        status: '状态',
        error: '错误信息',
      },
      status: {
        installing: '安装中',
        installed: '已安装',
        uninstalling: '卸载中',
        uninstalled: '未安装',
        error: '错误',
        abnormal: '异常',
      },
    },
    config: {
      form: {
        name: '名称',
        execCmd: '执行命令',
        pkgCmd: '依赖管理命令',
        proxy: '代理',
        defaultVersion: '默认版本',
      },
    },
    configSetup: {
      form: {
        status: '状态',
        version: '版本',
        error: '错误',
      },
    },
    task: {
      tasks: '任务',
      form: {
        action: '操作',
        node: '节点',
        status: '状态',
        dependencies: '依赖',
        time: '时间',
        logs: '日志',
      },
    },
    spider: {
      form: {
        name: '名称',
        dependencyType: '依赖类型',
        requiredVersion: '所需版本',
        installedVersion: '已安装版本',
        installedNodes: '已安装节点',
      },
    },
    common: {
      status: {
        installed: '已安装',
        installable: '可安装',
        upgradable: '可升级',
        downgradable: '可降级',
        noDependencyType: '无依赖类型',
      },
      actions: {
        installAndUpgrade: '安装并升级',
        installAndDowngrade: '安装并降级',
        searchDependencies: '搜索依赖',
      },
    },
  },
};

export default env;
