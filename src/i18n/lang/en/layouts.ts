const layouts: LLayouts = {
  components: {
    header: {
      logout: 'Logout',
      mySettings: 'My Settings',
      disclaimer: 'Disclaimer',
    },
    sidebar: {
      collapse: 'Collapse Sidebar',
      expand: 'Expand Sidebar',
    },
  },
  detailLayout: {
    navTabs: {
      toggle: {
        tooltip: {
          expand: 'Expand actions bar',
          collapse: 'Collapse actions bar',
        },
      },
    },
  },
  routes: {
    home: 'Home',
    nodes: {
      title: 'Nodes',
      tabs: {
        overview: 'Overview',
        tasks: 'Tasks',
        monitoring: 'Monitoring',
      },
    },
    projects: {
      title: 'Projects',
      tabs: {
        overview: 'Overview',
        spiders: 'Spiders',
      },
    },
    spiders: {
      title: 'Spiders',
      tabs: {
        overview: 'Overview',
        files: 'Files',
        tasks: 'Tasks',
        schedules: 'Schedules',
        data: 'Data',
        settings: 'Settings',
        dependencies: 'Dependencies',
      },
    },
    tasks: {
      title: 'Tasks',
      tabs: {
        overview: 'Overview',
        logs: 'Logs',
        data: 'Data',
      },
    },
    schedules: {
      title: 'Schedules',
      tabs: {
        overview: 'Overview',
        tasks: 'Tasks',
      },
    },
    users: {
      title: 'Users',
      tabs: {
        overview: 'Overview',
      },
    },
    roles: {
      title: 'Roles',
      tabs: {
        overview: 'Overview',
        permissions: 'Permissions',
        users: 'Users',
      },
    },
    permissions: {
      title: 'Permissions',
      tabs: {
        overview: 'Overview',
        roles: 'Roles',
      },
    },
    tokens: {
      title: 'Tokens',
    },
    dependencies: {
      title: 'Dependencies',
      settings: 'Settings',
      lang: {
        python: 'Python',
        node: 'Node',
      },
    },
    notifications: {
      title: 'Notifications',
      settings: {
        title: 'Settings',
        tabs: {
          overview: 'Overview',
          mail: 'Mail Config',
          template: 'Template',
          channels: 'Channels',
        },
      },
      channels: {
        title: 'Channels',
        tabs: {
          overview: 'Overview',
        },
      },
      requests: {
        title: 'Requests',
      },
      alerts: {
        title: 'Alerts',
        tabs: {
          overview: 'Overview',
        },
      },
    },
    gits: {
      title: 'Git Repo',
      tabs: {
        overview: 'Overview',
        files: 'Files',
        logs: 'Logs',
        changes: 'Changes',
        spiders: 'Spiders',
      },
    },
    databases: {
      title: 'Data Sources',
      tabs: {
        overview: 'Overview',
        databases: 'Databases',
        console: 'Console',
        monitoring: 'Monitoring',
        table: 'Table',
        data: 'Data',
        columns: 'Columns',
        indexes: 'Indexes',
      },
    },
    environments: {
      title: 'Environments',
    },
    system: {
      title: 'System',
    },
    misc: {
      disclaimer: 'Disclaimer',
      mySettings: 'My Settings',
    },
  },
};

export default layouts;
