const ds: LViewsDataSource = {
  navActions: {
    new: {
      label: 'New Data Source',
      tooltip: 'Create a new data source',
    },
    filter: {
      search: {
        placeholder: 'Search Data Source',
      },
    },
  },
  navActionsExtra: {
    filter: {
      select: {
        type: {
          label: 'Type',
        },
        status: {
          label: 'Status',
        },
        connectType: {
          label: 'Connect Type',
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
};

export default ds;
