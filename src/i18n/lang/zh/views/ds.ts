const ds: LViewsDataSource = {
  navActions: {
    new: {
      label: '新建数据源',
      tooltip: '添加一个新数据源',
    },
    filter: {
      search: {
        placeholder: '搜索数据源',
      },
    },
  },
  navActionsExtra: {
    filter: {
      select: {
        type: {
          label: '类型',
        },
        status: {
          label: '状态',
        },
        connectType: {
          label: '连接类型',
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

export default ds;
