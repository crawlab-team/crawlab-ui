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
          label: 'Data Source',
        },
        status: {
          label: 'Status',
        },
        database: {
          label: 'Database',
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
  },
};

export default database;
