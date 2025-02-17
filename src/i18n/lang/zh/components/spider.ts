const spider: LComponentsSpider = {
  form: {
    name: '名称',
    project: '项目',
    command: '执行命令',
    param: '参数',
    defaultMode: '默认模式',
    resultsCollection: '结果集',
    selectedTags: '指定标签',
    selectedNodes: '指定节点',
    description: '描述',
    priority: '优先级',
    incrementalSync: '增量同步文件',
    autoInstall: '自动安装依赖',
    autoInstallDisabled: '自动安装依赖 (仅限 Crawlab Pro)',
    git: 'Git 仓库',
    gitRootPath: 'Git 仓库路径',
    template: '模板',
    templateParams: {
      spiderName: '爬虫名称',
      startUrls: '起始 URL',
      domains: '域名',
    },
    templateDoc: '模版相关文档',
  },
  actions: {
    files: {
      tooltip: {
        fileEditorActions: '文件编辑器操作',
        uploadFiles: '上传文件',
        fileEditorSettings: '文件编辑器设置',
        export: '导出文件',
        createWithAi: '用 AI 创建',
        createWithAiDisabled: '用 AI 创建 (仅限 Crawlab Pro)',
      },
    },
    data: {
      tooltip: {
        dataActions: '数据操作',
        export: '导出',
        displayAllFields: '显示所有字段 (包括隐藏字段)',
        inferDataFieldsTypes: '推断数据字段类型',
        dedup: {
          enabled: '已启用去重',
          disabled: '已禁用去重',
          fields: '设置去重字段',
        },
      },
      placeholder: {
        table: '请选择表',
      },
    },
  },
  stat: {
    totalTasks: '总任务数',
    totalResults: '总结果数',
    averageWaitDuration: '平均等待时间',
    averageRuntimeDuration: '平均运行时间',
    averageTotalDuration: '平均总时间',
  },
  dialog: {
    run: {
      title: '运行爬虫',
    },
  },
  message: {
    success: {
      scheduleTask: '派发任务成功',
    },
  },
  messageBox: {
    confirm: {
      changeDatabase: {
        title: '更改数据库',
        message:
          '确定要更改数据库吗？此更改可能导致查看或保存爬虫数据时出现问题。',
      },
    },
  },
};

export default spider;
