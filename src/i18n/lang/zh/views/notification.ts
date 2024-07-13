const notification: LViewsNotification = {
  navActions: {
    new: {
      label: '新建通知',
      tooltip: '创建一个新的通知',
    },
    filter: {
      search: {
        placeholder: '搜索通知',
      },
    },
  },
  settings: {
    form: {
      name: '名称',
      description: '描述',
      type: '类型',
      enabled: '是否启用',
      title: '标题',
      template: '模板',
      templateContent: '模板内容',
      triggerTarget: '触发目标',
      trigger: '触发器',
      mail: {
        smtp: {
          server: 'SMTP 服务器',
          port: 'SMTP 端口',
          user: 'SMTP 用户',
          password: 'SMTP 密码',
          sender: {
            email: '发件人邮箱',
            identity: '发件人身份',
          },
        },
        to: '收件人',
        cc: '抄送',
      },
      mobile: {
        webhook: 'Webhook',
      },
    },
    type: {
      mail: '邮件',
      mobile: '移动端',
    },
  },
  triggerTargets: {
    task: '任务',
    node: '节点',
  },
  triggers: {
    task: {
      finish: '任务完成时触发',
      error: '任务失败时触发',
      emptyResults: '任务结果为空时触发',
      never: '从不触发',
    },
    node: {
      statusChange: '节点状态变化时触发',
      online: '节点上线时触发',
      offline: '节点下线时触发',
      never: '从不触发',
    },
  },
  tabs: {
    overview: '概览',
    triggers: '触发器',
    template: '模板',
  },
};

export default notification;
