const layouts: LLayouts = {
  components: {
    header: {
      logout: '注销',
      mySettings: '我的设置',
      disclaimer: '免责声明',
    },
    sidebar: {
      collapse: '折叠导航栏',
      expand: '展开导航栏',
    },
  },
  detailLayout: {
    navTabs: {
      toggle: {
        tooltip: {
          expand: '展开操作栏',
          collapse: '折叠操作栏',
        },
      },
    },
  },
  routes: {
    home: '首页',
    nodes: {
      title: '节点',
      tabs: {
        overview: '概览',
        tasks: '任务',
        monitoring: '监控',
      },
    },
    projects: {
      title: '项目',
      tabs: {
        overview: '概览',
        spiders: '爬虫',
      },
    },
    spiders: {
      title: '爬虫',
      tabs: {
        overview: '概览',
        files: '文件',
        tasks: '任务',
        schedules: '计划',
        data: '数据',
        settings: '设置',
        dependencies: '依赖',
      },
    },
    tasks: {
      title: '任务',
      tabs: {
        overview: '概览',
        logs: '日志',
        data: '数据',
      },
    },
    schedules: {
      title: '定时任务',
      tabs: {
        overview: '概览',
        tasks: '任务',
      },
    },
    users: {
      title: '用户',
      tabs: {
        overview: '概览',
      },
    },
    roles: {
      title: '角色',
      tabs: {
        overview: '概览',
        permissions: '权限',
        users: '用户',
      },
    },
    permissions: {
      title: '权限',
      tabs: {
        overview: '概览',
        roles: '角色',
      },
    },
    tokens: {
      title: '令牌',
    },
    dependencies: {
      title: '环境依赖',
      settings: '设置',
      lang: {
        python: 'Python',
        node: 'Node',
      },
    },
    notifications: {
      title: '消息通知',
      settings: {
        title: '通知配置',
        tabs: {
          overview: '概览',
          mail: '邮件配置',
          template: '模板',
          channels: '通知渠道',
        },
      },
      channels: {
        title: '通知渠道',
        tabs: {
          overview: '概览',
        },
      },
      requests: {
        title: '通知请求',
      },
      alerts: {
        title: '警报配置',
        tabs: {
          overview: '概览',
        },
      },
    },
    gits: {
      title: 'Git 仓库',
      tabs: {
        overview: '概览',
        files: '文件',
        changes: '变更',
        commits: '提交历史',
        spiders: '爬虫',
      },
    },
    databases: {
      title: '数据库',
      tabs: {
        overview: '概览',
        databases: '数据库',
        console: '控制台',
        monitoring: '监控',
        table: '表',
        data: '数据',
        columns: '列',
        indexes: '索引',
      },
    },
    environments: {
      title: '环境变量',
    },
    system: {
      title: '系统设置',
    },
    misc: {
      disclaimer: '免责声明',
      mySettings: '我的设置',
    },
  },
};

export default layouts;
