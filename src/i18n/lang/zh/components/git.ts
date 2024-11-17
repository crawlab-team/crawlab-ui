const git: LComponentsGit = {
  form: {
    repoUrl: '仓库 URL',
    name: '名称',
    currentBranch: '当前分支',
    authType: '验证类型',
    username: '用户名',
    password: '密码',
    privateKey: '私钥',
    status: '状态',
    error: '错误',
    autoPull: '自动拉取',
    urlInvalid: '无效 URL',
    spider: '爬虫',
    cloneLogs: '克隆日志',
  },
  common: {
    currentBranch: '当前分支',
    message: {
      success: {
        checkout: '切换至 {branch}',
        pull: '成功拉取代码',
        commit: '成功提交 {fileCount} 个文件',
        push: '成功推送代码',
        createSpider: {
          title: '成功创建爬虫.',
          action: '查看爬虫',
        },
      },
    },
    messageBox: {
      confirm: {
        branch: {
          delete: '确定删除该分支?',
        },
        push: '确定推送到远端?',
      },
      prompt: {
        branch: {
          new: {
            title: '新分支名称',
            validate: {
              notEmpty: '不能为空',
              notSame: '不能与当前分支同名',
            },
          },
        },
        commit: {
          title: '提交信息',
          placeholder: '请输入提交信息',
          validate: {
            notEmpty: '不能为空',
          },
        },
      },
    },
    box: {
      title: {
        pull: '拉取代码',
        push: '推送代码',
      },
    },
    actions: {
      pull: '拉取代码',
      commit: '提交代码',
    },
    status: {
      loading: {
        label: '加载中',
        tooltip: '正在加载远程 Git 数据, 请稍后...',
      },
    },
  },
  branches: {
    select: '选择分支',
    new: '新建分支',
    local: '本地分支',
    remote: '远程分支',
    pull: '拉取 (Pull)',
    commit: '提交 (Commit)',
    push: '推送 (Push)',
  },
  tags: {
    new: '新建标签',
  },
  actions: {
    title: 'Git 操作',
    label: {
      retry: '重试',
      checkout: '签出',
      pull: '拉取',
      commit: '提交',
      rollback: '回滚',
      push: '推送',
    },
    tooltip: {
      retry: '重试',
      checkout: '签出 (Checkout)',
      pull: '从远端仓库拉取 (Pull)',
      commit: '提交代码 (Commit)',
      rollback: '回滚变更 (Rollback)',
      push: '推送到远端仓库 (Push)',
    },
  },
  status: {
    label: {
      pending: '待处理',
      cloning: '克隆中',
      ready: '就绪',
      error: '错误',
      pulling: '拉取中',
      pushing: '推送中',
      unknown: '未知',
    },
    tooltip: {
      pending: 'Git 仓库待克隆',
      cloning: 'Git 仓库克隆中',
      ready: 'Git 仓库就绪',
      error: 'Git 仓库克隆过程中出现错误',
      pulling: 'Git 仓库拉取中',
      pushing: 'Git 仓库推送中',
      unknown: '未知 Git 仓库状态',
    },
  },
  tabs: {
    remote: '远程',
    references: '引用',
    logs: '日志',
    changes: '变更',
    ignore: '忽略',
  },
  checkout: {
    type: '类别',
    reference: '引用',
  },
  references: {
    type: {
      branch: '分支',
      tag: '标签',
    },
    table: {
      columns: {
        timestamp: '时间戳',
      },
    },
  },
  logs: {
    table: {
      columns: {
        reference: '引用',
        commitMessage: '提交信息',
        author: '作者',
        timestamp: '时间戳',
      },
    },
  },
  changes: {
    status: {
      untracked: '未跟踪',
      modified: '更新',
      added: '添加',
      deleted: '删除',
      renamed: '重命名',
      copied: '复制',
      updatedButUnmerged: '更新但未合并',
    },
    table: {
      columns: {
        changedFile: '变更文件',
        status: '状态',
      },
      actions: {
        add: '添加',
        rollback: '回滚',
        diff: '查看变更 (Diff)',
      },
      empty: '没有需要提交的内容, 工作区是干净的',
    },
  },
  spiders: {
    title: '爬虫操作',
    actions: {
      label: {
        create: '新建爬虫',
      },
      tooltip: {
        create: '创建一个新的爬虫',
      },
    },
    gitRootPath: 'Git 仓库路径',
  },
  diff: {
    title: '文件变更',
  },
  providers: {
    github: 'GitHub',
    bitbucket: 'Bitbucket',
    gitlab: 'GitLab',
    aws: 'AWS',
    git: 'Git',
  },
};

export default git;
