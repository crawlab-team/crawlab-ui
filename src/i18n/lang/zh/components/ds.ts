const ds: LComponentsDataSource = {
  label: {
    text: '数据源',
    tooltip: '数据源',
  },
  form: {
    name: '名称',
    type: '类别',
    status: '状态',
    description: '描述',
    host: '主机',
    port: '端口',
    url: 'URL',
    hosts: '主机列表',
    address: '地址',
    username: '用户名',
    password: '密码',
    changePassword: '更改密码',
    database: '数据库',
    connectType: '连接类型',
    connectSettings: '连接配置',
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
  type: {
    default: '默认',
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
      online: '在线',
      offline: '离线',
      unknown: '未知',
    },
    tooltip: {
      online: '数据源处于在线状态',
      offline: '数据源处于离线状态',
      unknown: '未知数据源状态',
    },
  },
  default: {
    host: '默认主机',
    port: '默认端口',
  },
  message: {
    success: {
      change: '更改数据源成功',
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
};

export default ds;
