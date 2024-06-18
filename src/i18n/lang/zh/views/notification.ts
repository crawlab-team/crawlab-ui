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
  triggers: {
    taskTrigger: '任务触发器',
    taskTriggerFinish: '任务完成时触发',
    taskTriggerError: '任务失败时触发',
    taskTriggerEmptyResults: '任务结果为空时触发',
    taskTriggerNever: '从不触发',
  },
  tabs: {
    overview: '概览',
    triggers: '触发器',
    template: '模板',
  },
};

export default notification;
