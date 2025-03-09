export declare global {
  interface LRouter {
    menuItems: {
      home: string;
      nodes: string;
      projects: string;
      spiders: string;
      schedules: string;
      tasks: string;
      git: string;
      databases: string;
      users: string;
      permissions: {
        title: string;
        children: {
          users: string;
          roles: string;
        };
      };
      tokens: string;
      dependencies: string;
      env: {
        deps: {
          title: string;
          settings: string;
          python: string;
          node: string;
        };
      };
      notification: {
        title: string;
        settings: string;
        channels: string;
        requests: string;
        alerts: string;
      };
      environment: string;
      system: string;
      misc: {
        title: string;
        children: {
          myAccount: string;
          pat: string;
          disclaimer: string;
        };
      };
    };
  }
}
