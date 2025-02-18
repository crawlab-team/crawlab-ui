const database: LViewsDatabase = {
  navActions: {
    new: {
      label: '新建数据库',
      tooltip: '添加一个新数据库',
    },
    filter: {
      search: {
        placeholder: '搜索数据库',
      },
    },
  },
  navActionsExtra: {
    filter: {
      select: {
        dataSource: {
          label: '数据库类型',
        },
        status: {
          label: '状态',
        },
        database: {
          label: '数据库名称',
        },
        username: {
          label: '用户名',
        },
      },
      search: {
        connectSettings: {
          placeholder: '搜索连接设置',
        },
      },
    },
  },
  databases: {
    sidebar: {
      search: {
        placeholder: '搜索数据库项...',
      },
    },
    actions: {
      createDatabase: '创建数据库',
      createTable: '创建表',
    },
    dialog: {
      createDatabase: {
        title: '创建数据库',
      },
      createTable: {
        title: '创建表',
        tabs: {
          overview: {
            name: '概览',
            form: {
              name: '名称',
            },
          },
          columns: {
            name: '列',
          },
          indexes: {
            name: '索引',
          },
        },
      },
    },
  },
};

export default database;
