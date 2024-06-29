const gits: LViewGits = {
  table: {
    columns: {
      name: '名称',
      status: '状态',
      spiders: '爬虫',
    },
    actions: {
      tooltip: {
        deleteNotAllowed: '无法删除带有爬虫的 Git 仓库',
      },
    },
  },
  navActions: {
    new: {
      label: '新建 Git 仓库',
      tooltip: '添加一个新 Git 仓库',
    },
    filter: {
      search: {
        placeholder: '搜索 Git 仓库',
      },
    },
  },
};

export default gits;
