const router: LRouter = {
  menuItems: {
    home: '主页',
    nodes: '节点',
    projects: '项目',
    spiders: '爬虫',
    schedules: '定时任务',
    tasks: '任务',
    git: 'Git 仓库',
    databases: '数据库',
    users: '用户',
    permissions: {
      title: '权限管理',
      children: {
        users: '用户',
        roles: '角色',
      },
    },
    tokens: 'API 令牌',
    dependencies: '环境依赖',
    env: {
      deps: {
        title: '环境依赖',
        settings: '设置',
        python: 'Python',
        node: 'Node.js',
      },
    },
    notification: {
      title: '消息通知',
      settings: '通知配置',
      channels: '通知渠道',
      requests: '通知请求',
      alerts: '警报配置',
    },
    environment: '环境变量',
    system: '系统设置',
    misc: {
      title: '其他',
      children: {
        myAccount: '我的账户',
        pat: '个人访问令牌',
        disclaimer: '免责声明',
      },
    },
  },
};

export default router;
