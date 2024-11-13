const roles: LViewsRoles = {
  table: {
    columns: {
      name: '名称',
      description: '描述',
      pages: '可访问页面',
      users: '用户数',
    },
  },
  navActions: {
    new: {
      label: '新建角色',
      tooltip: '创建新角色',
    },
    filter: {
      search: {
        placeholder: '搜索角色',
      },
    },
  },
};

export default roles;
