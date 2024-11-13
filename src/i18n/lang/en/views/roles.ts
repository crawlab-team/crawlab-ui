const roles: LViewsRoles = {
  table: {
    columns: {
      name: 'Name',
      description: 'Description',
      pages: 'Accessible Pages',
      users: 'Users',
    },
  },
  navActions: {
    new: {
      label: 'New Role',
      tooltip: 'Create a new role',
    },
    filter: {
      search: {
        placeholder: 'Search roles',
      },
    },
  },
};

export default roles;
