interface LViewGits {
  table: {
    columns: {
      name: string;
      status: string;
      spiders: string;
    };
    actions: {
      tooltip: {
        deleteNotAllowed: string;
      };
    };
  };
  navActions: LNavActions;
}
