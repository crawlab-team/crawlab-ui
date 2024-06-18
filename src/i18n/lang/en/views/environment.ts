const environments: LViewsEnvironments = {
  table: {
    columns: {
      key: 'Key',
      value: 'Value',
    },
  },
  navActions: {
    new: {
      label: 'New Environment Variable',
      tooltip: 'Create a new environment variable',
    },
    filter: {
      search: {
        placeholder: 'Search environment variables',
      },
    },
  },
  messageBox: {
    prompt: {
      create: 'Please enter the key of environment variable',
    },
  },
};

export default environments;
