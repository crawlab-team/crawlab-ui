const layouts: LLayouts = {
  components: {
    header: {
      myAccount: 'My Account',
      pat: 'Personal Access Tokens',
      disclaimer: 'Disclaimer',
      logout: 'Logout',
    },
    tabsView: {
      add: 'Add Tab',
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
      list: {
        title: 'Node List',
      },
      detail: {
        title: 'Node Detail',
        tabs: {
          overview: 'Overview',
          tasks: 'Tasks',
          monitoring: 'Monitoring',
        },
      },
    },
    projects: {
      list: {
        title: 'Project List',
      },
      detail: {
        title: 'Project Detail',
        tabs: {
          overview: 'Overview',
          spiders: 'Spiders',
        },
      },
    },
    spiders: {
      list: {
        title: 'Spider List',
      },
      detail: {
        title: 'Spider Detail',
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
    },
    tasks: {
      list: {
        title: 'Task List',
      },
      detail: {
        title: 'Task Detail',
        tabs: {
          overview: 'Overview',
          logs: 'Logs',
          data: 'Data',
        },
      },
    },
    schedules: {
      list: {
        title: 'Schedule List',
      },
      detail: {
        title: 'Schedule Detail',
        tabs: {
          overview: 'Overview',
          tasks: 'Tasks',
        },
      },
    },
    users: {
      list: {
        title: 'User List',
      },
      detail: {
        title: 'User Detail',
        tabs: {
          overview: 'Overview',
        },
      },
    },
    roles: {
      list: {
        title: 'Role List',
      },
      detail: {
        title: 'Role Detail',
        tabs: {
          overview: 'Overview',
          pages: 'Pages',
          users: 'Users',
        },
      },
    },
    tokens: {
      list: {
        title: 'API Token List',
      },
    },
    dependencies: {
      list: {
        title: 'Dependency List',
      },
    },
    notifications: {
      title: 'Notifications',
      settings: {
        list: {
          title: 'Settings',
        },
        detail: {
          title: 'Setting Detail',
          tabs: {
            overview: 'Overview',
            mail: 'Mail Config',
            template: 'Template',
            channels: 'Channels',
          },
        },
      },
      channels: {
        list: {
          title: 'Channels',
        },
        detail: {
          title: 'Channel Detail',
          tabs: {
            overview: 'Overview',
          },
        },
      },
      requests: {
        list: {
          title: 'Requests',
        },
      },
      alerts: {
        list: {
          title: 'Alerts',
        },
        detail: {
          title: 'Alert Detail',
          tabs: {
            overview: 'Overview',
          },
        },
      },
    },
    gits: {
      list: {
        title: 'Git Repo List',
      },
      detail: {
        title: 'Git Repo Detail',
        tabs: {
          overview: 'Overview',
          files: 'Files',
          changes: 'Changes',
          commits: 'Commits',
          spiders: 'Spiders',
        },
      },
    },
    databases: {
      list: {
        title: 'Database List',
      },
      detail: {
        title: 'Database Detail',
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
    },
    environments: {
      list: {
        title: 'Environment List',
      },
    },
    system: {
      title: 'System',
      tabs: {
        customize: 'Customize',
        dependency: 'Dependency',
        environment: 'Environment',
        ai: 'AI Assistant',
      },
    },
    misc: {
      title: 'Miscellaneous',
      tabs: {
        myAccount: 'My Account',
        pat: 'Personal Access Tokens',
        disclaimer: 'Disclaimer',
      },
    },
  },
};

export default layouts;
