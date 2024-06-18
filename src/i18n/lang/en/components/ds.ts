const ds: LComponentsDataSource = {
  label: {
    text: 'Data Source',
    tooltip: 'Data Source',
  },
  form: {
    name: 'Name',
    type: 'Type',
    status: 'Status',
    description: 'Description',
    host: 'Host',
    port: 'Port',
    url: 'URL',
    hosts: 'Hosts',
    username: 'Username',
    password: 'Password',
    address: 'Address',
    changePassword: 'Change Password',
    database: 'Database',
    connectType: 'Connect Type',
    connectSettings: 'Connect Settings',
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
  type: {
    default: 'Default',
    mongo: 'MongoDB',
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    mssql: 'Microsoft SQL Server',
    sqlite: 'SQLite',
    cockroachdb: 'CockroachDB',
    elasticsearch: 'ElasticSearch',
    kafka: 'Kafka',
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

export default ds;
