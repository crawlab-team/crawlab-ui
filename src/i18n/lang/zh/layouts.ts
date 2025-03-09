const layouts: LLayouts = {
  components: {
    header: {
      myAccount: '我的账户',
      pat: '个人访问令牌',
      disclaimer: '免责声明',
      logout: '注销',
    },
    tabsView: {
      add: '添加标签页',
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
      list: {
        title: '节点列表',
      },
      detail: {
        title: '节点详情',
        tabs: {
          overview: '概览',
          tasks: '任务',
          monitoring: '监控',
        },
      },
    },
    projects: {
      list: {
        title: '项目列表',
      },
      detail: {
        title: '项目详情',
        tabs: {
          overview: '概览',
          spiders: '爬虫',
        },
      },
    },
    spiders: {
      list: {
        title: '爬虫列表',
      },
      detail: {
        title: '爬虫详情',
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
    },
    tasks: {
      list: {
        title: '任务列表',
      },
      detail: {
        title: '任务详情',
        tabs: {
          overview: '概览',
          logs: '日志',
          data: '数据',
        },
      },
    },
    schedules: {
      list: {
        title: '定时任务列表',
      },
      detail: {
        title: '定时任务详情',
        tabs: {
          overview: '概览',
          tasks: '任务',
        },
      },
    },
    users: {
      list: {
        title: '用户列表',
      },
      detail: {
        title: '用户详情',
        tabs: {
          overview: '概览',
        },
      },
    },
    roles: {
      list: {
        title: '角色列表',
      },
      detail: {
        title: '角色详情',
        tabs: {
          overview: '概览',
          pages: '页面',
          users: '用户',
        },
      },
    },
    tokens: {
      list: {
        title: 'API 令牌列表',
      },
    },
    dependencies: {
      list: {
        title: '依赖列表',
      },
    },
    notifications: {
      title: '消息通知',
      settings: {
        list: {
          title: '配置列表',
        },
        detail: {
          title: '通知配置详情',
          tabs: {
            overview: '概览',
            mail: '邮件配置',
            template: '模板',
            channels: '通知渠道',
          },
        },
      },
      channels: {
        list: {
          title: '渠道列表',
        },
        detail: {
          title: '通知渠道详情',
          tabs: {
            overview: '概览',
          },
        },
      },
      requests: {
        list: {
          title: '请求列表',
        },
      },
      alerts: {
        list: {
          title: '警报列表',
        },
        detail: {
          title: '警报配置详情',
          tabs: {
            overview: '概览',
          },
        },
      },
    },
    gits: {
      list: {
        title: 'Git 仓库列表',
      },
      detail: {
        title: 'Git 仓库详情',
        tabs: {
          overview: '概览',
          files: '文件',
          changes: '变更',
          commits: '提交历史',
          spiders: '爬虫',
        },
      },
    },
    databases: {
      list: {
        title: '数据库列表',
      },
      detail: {
        title: '数据库详情',
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
    },
    environments: {
      list: {
        title: '环境列表',
      },
    },
    system: {
      title: '系统设置',
      tabs: {
        customize: '自定义',
        dependency: '依赖设置',
        environment: '环境变量',
        ai: 'AI 助手',
      },
    },
    misc: {
      title: '其他',
      tabs: {
        myAccount: '我的账户',
        pat: '个人访问令牌',
        disclaimer: '免责声明',
      },
    },
  },
};

export default layouts;
