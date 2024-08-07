const database: LComponentsDatabase = {
  label: {
    text: 'Database',
    tooltip: 'Database',
  },
  form: {
    name: 'Name',
    description: 'Description',
    dataSource: 'Data Source',
    status: 'Status',
    host: 'Host',
    port: 'Port',
    url: 'URL',
    hosts: 'Hosts',
    username: 'Username',
    password: 'Password',
    address: 'Address',
    changePassword: 'Change Password',
    database: 'Database',
    mongo: {
      authSource: 'Auth Source',
      authMechanism: 'Auth Mechanism',
    },
    mysql: {
      charset: 'Charset',
      parseTime: 'Parse Time',
    },
    postgresql: {
      sslMode: 'SSL Mode',
    },
    default: {
      host: 'Default Host',
      port: 'Default Port',
      url: 'Default URL',
      database: 'Default Database',
    },
  },
  dataSources: {
    default: 'Default',
    mongo: 'MongoDB',
    mysql: 'MySQL',
    postgres: 'PostgreSQL',
    mssql: 'Microsoft SQL Server',
    elasticsearch: 'ElasticSearch',
    kafka: 'Kafka',
    redis: 'Redis',
  },
  status: {
    label: {
      online: 'Online',
      offline: 'Offline',
      unknown: 'Unknown',
    },
    tooltip: {
      online: 'Data source is currently online',
      offline: 'Data source is currently offline',
      unknown: 'Unknown data source status',
    },
  },
  default: {
    name: 'Default Database',
    host: 'Default Host',
    port: 'Default Port',
  },
  message: {
    success: {
      change: 'Changed data source successfully',
    },
  },
  connectType: {
    label: {
      standard: 'Standard',
      url: 'URL',
      hosts: 'Hosts',
    },
    tips: {
      standard:
        'Standard connect settings, normally used for single instance configurations',
      url: 'Connect settings with URL, suitable for more complex connect settings',
      hosts:
        'Hosts connect settings, normally used for multiple instances or cluster configurations',
    },
  },
};

export default database;
