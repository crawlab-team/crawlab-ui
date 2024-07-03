export declare global {
  interface LComponentsDataSource {
    label: {
      text: string;
      tooltip: string;
    };
    form: {
      name: string;
      type: string;
      status: string;
      description: string;
      host: string;
      port: string;
      url: string;
      hosts: string;
      address: string;
      database: string;
      username: string;
      password: string;
      changePassword: string;
      connectType: string;
      connectSettings: string;
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
    type: {
      default: string;
      mongo: string;
      mysql: string;
      postgresql: string;
      mssql: string;
      sqlite: string;
      cockroachdb: string;
      elasticsearch: string;
      kafka: string;
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
  }
}
