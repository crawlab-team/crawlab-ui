interface LViewsUsers {
  table: {
    columns: {
      username: string;
      fullName: string;
      email: string;
      role: string;
    };
  };
  navActions: LNavActions;
  navActionsExtra: {
    filter: {
      select: {
        role: {
          label: string;
        };
      };
      search: {
        email: {
          placeholder: string;
        };
      };
    };
  };
}
