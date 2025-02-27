const router: LRouter = {
  menuItems: {
    home: 'Home',
    nodes: 'Nodes',
    projects: 'Projects',
    spiders: 'Spiders',
    schedules: 'Schedules',
    tasks: 'Tasks',
    git: 'Git Repo',
    databases: 'Databases',
    users: 'Users',
    permissions: {
      title: 'Permissions',
      children: {
        users: 'Users',
        roles: 'Roles',
      },
    },
    tokens: 'API Tokens',
    dependencies: 'Dependencies',
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
      title: 'Miscellaneous',
      children: {
        myAccount: 'My Account',
        pat: 'Personal Access Tokens',
        disclaimer: 'Disclaimer',
      },
    },
  },
};

export default router;
