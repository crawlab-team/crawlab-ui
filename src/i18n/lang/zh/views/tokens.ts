const tokens: LViewsTokens = {
  table: {
    columns: {
      name: '名称',
      token: '访问令牌',
    },
  },
  navActions: {
    new: {
      label: '新建个人访问令牌',
      tooltip: '添加一个新的个人访问令牌',
    },
    filter: {
      search: {
        placeholder: '搜索个人访问令牌',
      },
    },
  },
  messageBox: {
    prompt: {
      create: {
        title: '请输入个人访问令牌名称',
        placeholder: '默认情况下，名称格式为"PAT <timestamp>"',
      },
    },
  },
};

export default tokens;
