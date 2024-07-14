const notification: LComponentsNotification = {
  dialog: {
    insertVariable: {
      title: '插入变量',
      form: {
        variableCategory: '变量类别',
        variable: '变量',
      },
      formRules: {
        variableEmpty: '请选择一个变量',
      },
    },
  },
  trigger: {
    label: '触发器',
    tooltip: '消息通知触发器设置',
    target: {
      label: '触发目标',
      change: {
        label: '切换触发目标',
        note: '注意：切换触发目标可能导致模板中的变量不可用',
      },
    },
    targets: {
      task: '任务',
      node: '节点',
    },
  },
  template: {
    mode: {
      change: {
        label: '切换编辑模式',
        note: '注意：切换编辑模式可能会导致样式或内容丢失',
      },
    },
    modes: {
      richText: '富文本',
      markdown: 'Markdown',
    },
  },
  variableCategories: {
    task: '任务',
    node: '节点',
    spider: '爬虫',
  },
  variables: {
    invalid: '无效变量',
    task: {
      status: '状态',
      mode: '模式',
      cmd: '命令',
      param: '参数',
      priority: '优先级',
      pid: '进程 ID',
      createdAt: '创建时间',
      updatedAt: '更新时间',
      stat: {
        startTs: '开始时间',
        endTs: '结束时间',
        waitDuration: '等待时长',
        runtimeDuration: '运行时长',
        totalDuration: '总时长',
        resultCount: '结果数',
      },
    },
    node: {
      key: '键',
      name: '名称',
      description: '描述',
      status: '状态',
      createdAt: '创建时间',
      updatedAt: '更新时间',
    },
    spider: {
      name: '名称',
      mode: '模式',
      cmd: '命令',
      param: '参数',
      priority: '优先级',
      stat: {
        results: '结果数',
        waitDuration: '等待时长',
        runtimeDuration: '运行时长',
        totalDuration: '总时长',
        averageWaitDuration: '平均等待时长',
        averageRuntimeDuration: '平均运行时长',
        averageTotalDuration: '平均总时长',
      },
    },
  },
};

export default notification;
