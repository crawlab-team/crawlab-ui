const database: LComponentsDatabase = {
  label: {
    text: '数据库',
    tooltip: '数据库',
  },
  form: {
    name: '名称',
    description: '描述',
    dataSource: '数据源',
    status: '状态',
    host: '主机 (Host)',
    port: '端口 (Port)',
    url: 'URL',
    hosts: '主机列表',
    address: '地址',
    username: '用户名',
    password: '密码',
    changePassword: '更改密码',
    database: '数据库',
    mongo: {
      authSource: '验证源',
      authMechanism: '验证机制',
    },
    mysql: {
      charset: '字符集',
      parseTime: '是否解析时间',
    },
    postgresql: {
      sslMode: 'SSL 模式',
    },
    default: {
      host: '默认主机',
      port: '默认端口',
      url: '默认 URL',
      database: '默认数据库',
    },
  },
  dataSources: {
    default: '默认',
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
      online: '在线',
      offline: '离线',
      unknown: '未知',
    },
    tooltip: {
      online: '数据库处于在线状态',
      offline: '数据库处于离线状态',
      unknown: '未知数据库状态',
    },
  },
  default: {
    name: '默认数据库',
    host: '默认主机',
    port: '默认端口',
  },
  message: {
    success: {
      change: '更改数据库成功',
    },
  },
  connectType: {
    label: {
      standard: '标准',
      url: 'URL',
      hosts: '多主机',
    },
    tips: {
      standard: '标准连接设置，通常用作单实例配置',
      url: 'URL 连接设置，适合较复杂的连接配置',
      hosts: '多主机连接设置, 通常适合多实例或集群配置',
    },
  },
  databases: {
    database: {
      name: '数据库名称',
      tables: {
        name: '表名称',
        columns: '列数',
        indexes: '索引数',
      },
    },
    table: {
      name: '表名称',
      columns: {
        name: '名称',
        type: '数据类型',
        null: '可空',
        default: '默认值',
      },
      indexes: {
        name: '名称',
        type: '类型',
        columns: '列',
        unique: '唯一',
      },
    },
  },
};

export default database;
