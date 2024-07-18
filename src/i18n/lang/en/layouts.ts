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
          template: 'Template',
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
    dataSources: {
      title: 'Data Sources',
      tabs: {
        overview: 'Overview',
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
