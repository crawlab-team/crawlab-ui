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
          label: '数据源',
        },
        status: {
          label: '状态',
        },
        database: {
          label: '数据库',
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
};

export default database;
