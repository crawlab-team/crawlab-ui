const users: LViewsUsers = {
  table: {
    columns: {
      username: 'Username',
      fullName: 'Full Name',
      email: 'Email',
      role: 'Role',
    },
  },
  navActions: {
    new: {
      label: 'New User',
      tooltip: 'Create a new user',
    },
    filter: {
      search: {
        placeholder: 'Search users',
      },
    },
  },
  navActionsExtra: {
    filter: {
      select: {
        role: {
          label: 'Role',
        },
      },
      search: {
        email: {
          placeholder: 'Search email',
        },
      },
    },
  },
};

export default users;
