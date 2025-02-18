const database: LViewsDatabase = {
  navActions: {
    new: {
      label: 'New Database',
      tooltip: 'Create a new database',
    },
    filter: {
      search: {
        placeholder: 'Search Database',
      },
    },
  },
  navActionsExtra: {
    filter: {
      select: {
        dataSource: {
          label: 'Database Type',
        },
        status: {
          label: 'Status',
        },
        database: {
          label: 'Database Name',
        },
        username: {
          label: 'Username',
        },
      },
      search: {
        connectSettings: {
          placeholder: 'Search Connect Settings',
        },
      },
    },
  },
  databases: {
    sidebar: {
      search: {
        placeholder: 'Search database items...',
      },
    },
    actions: {
      createDatabase: 'Create Database',
      createTable: 'Create Table',
    },
    dialog: {
      createDatabase: {
        title: 'Create Database',
      },
      createTable: {
        title: 'Create Table',
        tabs: {
          overview: {
            name: 'Overview',
            form: {
              name: 'Name',
            },
          },
          columns: {
            name: 'Columns',
          },
          indexes: {
            name: 'Indexes',
          },
        },
      },
    },
  },
};

export default database;
