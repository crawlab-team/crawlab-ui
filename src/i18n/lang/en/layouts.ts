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
      list: {
        title: 'Nodes',
      },
      detail: {
        title: 'Node',
        tabs: {
          overview: 'Overview',
          tasks: 'Tasks',
          monitoring: 'Monitoring',
        },
      },
    },
    projects: {
      list: {
        title: 'Projects',
      },
      detail: {
        title: 'Project',
        tabs: {
          overview: 'Overview',
          spiders: 'Spiders',
        },
      },
    },
    spiders: {
      list: {
        title: 'Spiders',
      },
      detail: {
        title: 'Spider',
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
        title: 'Tasks',
      },
      detail: {
        title: 'Task',
        tabs: {
          overview: 'Overview',
          logs: 'Logs',
          data: 'Data',
        },
      },
    },
    schedules: {
      list: {
        title: 'Schedules',
      },
      detail: {
        title: 'Schedule',
        tabs: {
          overview: 'Overview',
          tasks: 'Tasks',
        },
      },
    },
    users: {
      list: {
        title: 'Users',
      },
      detail: {
        title: 'User',
        tabs: {
          overview: 'Overview',
        },
      },
    },
    roles: {
      list: {
        title: 'Roles',
      },
      detail: {
        title: 'Role',
        tabs: {
          overview: 'Overview',
          permissions: 'Permissions',
          users: 'Users',
        },
      },
    },
    permissions: {
      list: {
        title: 'Permissions',
      },
      detail: {
        title: 'Permission',
        tabs: {
          overview: 'Overview',
          roles: 'Roles',
        },
      },
    },
    tokens: {
      list: {
        title: 'Tokens',
      },
    },
    dependencies: {
      list: {
        title: 'Dependencies',
      },
    },
    notifications: {
      title: 'Notifications',
      settings: {
        list: {
          title: 'Settings',
        },
        detail: {
          title: 'Setting',
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
          title: 'Channel',
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
          title: 'Alert',
          tabs: {
            overview: 'Overview',
          },
        },
      },
    },
    gits: {
      list: {
        title: 'Git Repos',
      },
      detail: {
        title: 'Git Repo',
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
        title: 'Data Sources',
      },
      detail: {
        title: 'Data Source',
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
        title: 'Environments',
      },
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
