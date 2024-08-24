export declare global {
  interface LComponentsDatabase {
    label: {
      text: string;
      tooltip: string;
    };
    form: {
      name: string;
      description: string;
      dataSource: string;
      status: string;
      host: string;
      port: string;
      url: string;
      hosts: string;
      address: string;
      database: string;
      username: string;
      password: string;
      changePassword: string;
      mongo: {
        authSource: string;
        authMechanism: string;
      };
      mysql: {
        charset: string;
        parseTime: string;
      };
      postgresql: {
        sslMode: string;
      };
      default: {
        host: string;
        port: string;
        url: string;
        database: string;
      };
    };
    dataSources: {
      default: string;
      mongo: string;
      mysql: string;
      postgres: string;
      mssql: string;
      elasticsearch: string;
      kafka: string;
      redis: string;
    };
    status: {
      label: {
        online: string;
        offline: string;
        unknown: string;
      };
      tooltip: {
        online: string;
        offline: string;
        unknown: string;
      };
    };
    default: {
      name: string;
      host: string;
      port: string;
    };
    message: {
      success: {
        change: string;
      };
    };
    connectType: {
      label: {
        standard: string;
        url: string;
        hosts: string;
      };
      tips: {
        standard: string;
        url: string;
        hosts: string;
      };
    };
    databases: {
      database: {
        name: string;
      };
      table: {
        name: string;
        columns: {
          name: string;
          type: string;
          null: string;
          default: string;
        };
        indexes: {
          name: string;
          type: string;
          columns: string;
          unique: string;
        };
      };
    };
  }
}
