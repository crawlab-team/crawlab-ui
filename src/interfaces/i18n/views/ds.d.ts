export declare global {
  interface LViewsDataSource {
    navActions: LNavActions;
    navActionsExtra: {
      filter: {
        select: {
          type: {
            label: string;
          };
          status: {
            label: string;
          };
          connectType: {
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
  }
}
