export declare global {
  interface LDetailLayoutPage<T = any> {
    title: string;
    tabs: T;
  }

  interface LListLayoutPage<T = any> {
    list: {
      title: string;
    };
    detail?: LDetailLayoutPage<T>;
  }

  interface LLayouts {
    components: {
      header: {
        myAccount: string;
        pat: string;
        disclaimer: string;
        logout: string;
      };
      tabsView: {
        add: string;
      };
      sidebar: {
        expand: string;
        collapse: string;
      };
    };
    detailLayout: {
      navTabs: {
        toggle: {
          tooltip: {
            expand: string;
            collapse: string;
          };
        };
      };
    };
    routes: {
      home: string;
      nodes: LListLayoutPage<{
        overview: string;
        tasks: string;
        monitoring: string;
      }>;
      projects: LListLayoutPage<{
        overview: string;
        spiders: string;
      }>;
      spiders: LListLayoutPage<{
        overview: string;
        files: string;
        tasks: string;
        schedules: string;
        data: string;
        settings: string;
        dependencies: string;
      }>;
      tasks: LListLayoutPage<{
        overview: string;
        logs: string;
        data: string;
      }>;
      schedules: LListLayoutPage<{
        overview: string;
        tasks: string;
      }>;
      users: LListLayoutPage<{
        overview: string;
      }>;
      roles: LListLayoutPage<{
        overview: string;
        pages: string;
        users: string;
      }>;
      tokens: LListLayoutPage;
      dependencies: LListLayoutPage;
      notifications: {
        title: string;
        settings: LListLayoutPage<{
          overview: string;
          mail: string;
          template: string;
          channels: string;
        }>;
        channels: LListLayoutPage<{
          overview: string;
        }>;
        requests: LListLayoutPage;
        alerts: LListLayoutPage<{
          overview: string;
        }>;
      };
      gits: LListLayoutPage<{
        overview: string;
        files: string;
        changes: string;
        commits: string;
        spiders: string;
      }>;
      databases: LListLayoutPage<{
        overview: string;
        databases: string;
        console: string;
        monitoring: string;
        table: string;
        data: string;
        columns: string;
        indexes: string;
      }>;
      environments: LListLayoutPage;
      system: LDetailLayoutPage<{
        customize: string;
        dependency: string;
        environment: string;
        ai: string;
      }>;
      misc: LDetailLayoutPage<{
        myAccount: string;
        pat: string;
        disclaimer: string;
      }>;
    };
  }
}
