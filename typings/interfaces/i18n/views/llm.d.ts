interface LViewsLLM {
  provider: {
    table: {
      columns: {
        key: string;
        name: string;
        enabled: string;
        priority: string;
      };
    };
    navActions: LNavActions;
  };
}
