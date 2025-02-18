const database: LComponentsDatabase = {
  label: {
    text: '数据库',
    tooltip: '数据库',
  },
  form: {
    name: '名称',
    description: '描述',
    dataSource: '数据库类型',
    status: '状态',
    host: '主机 (Host)',
    port: '端口 (Port)',
    url: 'URL',
    hosts: '主机列表',
    address: '地址',
    username: '用户名',
    password: '密码',
    changePassword: '更改密码',
    database: '数据库名称',
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
    warning: {
      emptyQuery: '查询为空, 请选择执行查询语句',
    },
  },
  messageBox: {
    confirm: {
      renameTable: {
        title: '重命名表',
        message: '确定要重命名表吗？',
      },
    },
    prompt: {
      dropTable: {
        title: '删除表',
        message: '确定要删除表 "{tableName}" 吗？',
        placeholder: '请输入表名 "{tableName}" 以确认',
        error: '表名不正确',
      },
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
      create: {
        name: '新数据库名称',
      },
    },
    table: {
      name: '表名称',
      columns: {
        name: '名称',
        type: '数据类型',
        notNull: '非空',
        default: '默认值',
        primary: '主键',
        autoIncrement: '自增',
      },
      indexes: {
        name: '名称',
        type: '类型',
        columns: '列',
        unique: '唯一',
        column: {
          name: '列名',
          order: '顺序',
        },
      },
      create: {
        name: '新表名称',
      },
      actions: {
        addColumn: '添加列',
        editColumns: '编辑列',
        editIndexColumns: '编辑索引列',
        editIndexes: '编辑索引',
        truncate: '清空 (Truncate)',
        drop: '删除 (Drop)',
      },
    },
    labels: {
      columns: '列',
      indexes: '索引',
    },
  },
  actions: {
    commitChanges: '提交更改',
    rollbackChanges: '回滚更改',
    runQuery: '运行查询',
  },
};

export default database;
