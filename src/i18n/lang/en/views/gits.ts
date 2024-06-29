const gits: LViewGits = {
  table: {
    columns: {
      name: 'Name',
      status: 'Status',
      spiders: 'Spiders',
    },
    actions: {
      tooltip: {
        deleteNotAllowed: 'Cannot delete the git repo with spiders',
      },
    },
  },
  navActions: {
    new: {
      label: 'New Git Repo',
      tooltip: 'Create a new git repo',
    },
    filter: {
      search: {
        placeholder: 'Search git repos',
      },
    },
  },
};

export default gits;
