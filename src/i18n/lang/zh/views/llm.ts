const llm: LViewsLLM = {
  provider: {
    table: {
      columns: {
        key: 'Key',
        name: 'Name',
        enabled: 'Enabled',
        priority: 'Priority',
      },
    },
    navActions: {
      new: {
        label: 'New LLM Provider',
        tooltip: 'Create a new LLM provider',
      },
      filter: {
        search: {
          placeholder: 'Search LLM providers',
        },
      },
    },
  },
};

export default llm;
