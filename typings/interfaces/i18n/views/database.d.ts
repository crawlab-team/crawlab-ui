export declare global {
  interface LViewsDatabase {
    navActions: LNavActions;
    navActionsExtra: {
      filter: {
        select: {
          dataSource: {
            label: string;
          };
          status: {
            label: string;
          };
          database: {
            label: string;
          };
          username: {
            label: string;
          };
        };
        search: {
          connectSettings: {
            placeholder: string;
          };
        };
      };
    };
    databases: {
      sidebar: {
        search: {
          placeholder: string;
        };
      };
    };
  }
}
