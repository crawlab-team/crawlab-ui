const router: LRouter = {
  menuItems: {
    home: 'Home',
    nodes: 'Nodes',
    projects: 'Projects',
    spiders: 'Spiders',
    schedules: 'Schedules',
    tasks: 'Tasks',
    git: 'Git Repo',
    ds: 'Data Sources',
    users: 'Users',
    tags: 'Tags',
    tokens: 'Tokens',
    plugins: 'Plugins',
    env: {
      deps: {
        title: 'Dependencies',
        settings: 'Settings',
        python: 'Python',
        node: 'Node.js',
      },
    },
    notification: {
      title: 'Notifications',
      settings: 'Notification Settings',
      channels: 'Notification Channels',
      requests: 'Notification Requests',
      alerts: 'Notification Alerts',
    },
    environment: 'Environment',
    system: 'System Settings',
    misc: {
      disclaimer: 'Disclaimer',
      mySettings: 'My Settings',
    },
  },
};

export default router;
