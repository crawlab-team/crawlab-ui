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
  messageBox: {
    prompt: {
      dropTable: {
        title: 'Drop Table',
        message: 'Are you sure you want to drop the table?',
        placeholder: 'Please type the table name to confirm',
        error: 'Table name does not match',
      },
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
  databases: {
    database: {
      name: 'Database Name',
      tables: {
        name: 'Table Name',
        columns: 'Columns',
        indexes: 'Indexes',
      },
      create: {
        name: 'New database name',
      },
    },
    table: {
      name: 'Table Name',
      columns: {
        name: 'Name',
        type: 'Data Type',
        notNull: 'Not Null',
        default: 'Default Expression',
        primary: 'Primary Key',
      },
      indexes: {
        name: 'Name',
        type: 'Type',
        columns: 'Columns',
        unique: 'Unique',
        column: {
          name: 'Column Name',
          order: 'Column Order',
        },
      },
      create: {
        name: 'New table name',
      },
      actions: {
        addColumn: 'Add Column',
        editIndexColumns: 'Edit Index Columns',
      },
    },
  },
  actions: {
    commitChanges: 'Commit Changes',
    rollbackChanges: 'Rollback Changes',
  },
};

export default database;
