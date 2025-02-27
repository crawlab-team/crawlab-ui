const tokens: LViewsTokens = {
  table: {
    columns: {
      name: 'Name',
      token: 'Access Token',
    },
  },
  navActions: {
    new: {
      label: 'New PAT',
      tooltip: 'Create a new personal access token',
    },
    filter: {
      search: {
        placeholder: 'Search PAT',
      },
    },
  },
  messageBox: {
    prompt: {
      create: {
        title: 'Please enter the name of personal access token',
        placeholder:
          'By default, the name will be in format of "PAT <timestamp>"',
      },
    },
  },
};

export default tokens;
