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
      list: {
        title: '节点',
      },
      detail: {
        title: '节点',
        tabs: {
          overview: '概览',
          tasks: '任务',
          monitoring: '监控',
        },
      },
    },
    projects: {
      list: {
        title: '项目',
      },
      detail: {
        title: '项目',
        tabs: {
          overview: '概览',
          spiders: '爬虫',
        },
      },
    },
    spiders: {
      list: {
        title: '爬虫',
      },
      detail: {
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
    },
    tasks: {
      list: {
        title: '任务',
      },
      detail: {
        title: '任务',
        tabs: {
          overview: '概览',
          logs: '日志',
          data: '数据',
        },
      },
    },
    schedules: {
      list: {
        title: '定时任务',
      },
      detail: {
        title: '定时任务',
        tabs: {
          overview: '概览',
          tasks: '任务',
        },
      },
    },
    users: {
      list: {
        title: '用户',
      },
      detail: {
        title: '用户',
        tabs: {
          overview: '概览',
        },
      },
    },
    roles: {
      list: {
        title: '角色',
      },
      detail: {
        title: '角色',
        tabs: {
          overview: '概览',
          permissions: '权限',
          users: '用户',
        },
      },
    },
    permissions: {
      list: {
        title: '权限',
      },
      detail: {
        title: '权限',
        tabs: {
          overview: '概览',
          roles: '角色',
        },
      },
    },
    tokens: {
      list: {
        title: '令牌',
      },
    },
    dependencies: {
      list: {
        title: '环境依赖',
      },
    },
    notifications: {
      title: '消息通知',
      settings: {
        list: {
          title: '通知配置',
        },
        detail: {
          title: '通知配置',
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
          title: '通知渠道',
        },
        detail: {
          title: '通知渠道',
          tabs: {
            overview: '概览',
          },
        },
      },
      requests: {
        list: {
          title: '通知请求',
        },
      },
      alerts: {
        list: {
          title: '警报配置',
        },
        detail: {
          title: '警报配置',
          tabs: {
            overview: '概览',
          },
        },
      },
    },
    gits: {
      list: {
        title: 'Git 仓库',
      },
      detail: {
        title: 'Git 仓库',
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
        title: '数据库',
      },
      detail: {
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
    },
    environments: {
      list: {
        title: '环境变量',
      },
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
