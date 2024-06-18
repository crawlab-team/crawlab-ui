const router: LRouter = {
  menuItems: {
    home: '主页',
    nodes: '节点',
    projects: '项目',
    spiders: '爬虫',
    schedules: '定时任务',
    tasks: '任务',
    git: 'Git 仓库',
    ds: '数据源',
    users: '用户',
    tags: '标签',
    tokens: '令牌',
    plugins: '插件',
    env: {
      deps: {
        title: '环境依赖',
        settings: '设置',
        python: 'Python',
        node: 'Node.js',
      },
    },
    notification: '消息通知',
    environment: '环境变量',
    system: '系统设置',
    misc: {
      disclaimer: '免责声明',
      mySettings: '我的设置',
    },
  },
};

export default router;
