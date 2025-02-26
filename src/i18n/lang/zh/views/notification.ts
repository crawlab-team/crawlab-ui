const notification: LViewsNotification = {
  settings: {
    navActions: {
      new: {
        label: '新建通知配置',
        tooltip: '创建一个新的通知配置',
      },
      filter: {
        search: {
          placeholder: '搜索通知配置',
        },
      },
    },
    form: {
      name: '名称',
      description: '描述',
      enabled: '是否启用',
      title: '标题',
      template: '模板',
      templateContent: '模板内容',
      triggerTarget: '触发目标',
      trigger: '触发器',
      hasMail: '是否有邮件',
      senderEmail: '发件人邮箱',
      useCustomSenderEmail: {
        label: '使用自定义发件人邮箱',
        tooltip:
          '使用自定义发件人邮箱地址，否则使用 SMTP 设置中配置的默认发件人邮箱地址',
      },
      senderName: '发件人姓名',
      mailTo: '发送至',
      mailCc: '抄送',
      mailBcc: '密送',
      alert: '监控警报',
      useCustomSetting: {
        label: '使用自定义设置',
        tooltip: '使用自定义设置，否则选择一个模板',
      },
    },
    formRules: {
      invalidEmail: '请输入有效的邮箱地址',
    },
    triggerTargets: {
      task: '任务',
      node: '节点',
      alert: '监控警报',
    },
    triggers: {
      task: {
        finish: '任务完成时触发',
        error: '任务失败时触发',
        emptyResults: '任务结果为空时触发',
      },
      node: {
        statusChange: '节点状态变化时触发',
        online: '节点上线时触发',
        offline: '节点下线时触发',
      },
    },
    warnings: {
      missingMailConfigFields: {
        content:
          '您选择了至少一个邮件通知渠道。为了发送邮件消息通知，您必须在邮件配置中设置必填字段。',
        action: '前往邮件配置',
      },
      emptyChannel: {
        content: '请选择至少一个通知渠道。',
      },
      noWarning: {
        content: '通知配置有效。',
      },
    },
    templates: {
      label: '选择模板',
    },
    actions: {
      createAlert: '创建通知警报',
    },
  },
  channels: {
    navActions: {
      new: {
        label: '新建通知渠道',
        tooltip: '创建一个新的通知渠道',
      },
      filter: {
        search: {
          placeholder: '搜索通知渠道',
        },
      },
    },
    form: {
      type: '类型',
      name: '名称',
      description: '描述',
      provider: '服务商',
      smtpServer: 'SMTP 服务器',
      smtpPort: 'SMTP 端口',
      smtpUsername: 'SMTP 用户名',
      smtpPassword: 'SMTP 密码',
      webhookUrl: 'Webhook URL',
      telegramBotToken: '电报机器人令牌',
      telegramChatId: '电报聊天 ID',
      googleOAuth2Json: '谷歌 OAuth2 JSON',
    },
    types: {
      mail: '邮件 (Email)',
      im: '即时通讯 (IM)',
    },
    providers: {
      gmail: '谷歌邮箱 (Gmail)',
      outlook: '微软邮箱 (Outlook)',
      qq: 'QQ 邮箱',
      '163': '163 邮箱',
      icloud: 'iCloud 邮箱',
      yahoo: '雅虎 (Yahoo)',
      aol: '美国在线 (AOL)',
      zoho: '卓豪 (Zoho)',
      wechat_work: '企业微信 (Wechat Work)',
      dingtalk: '钉钉 (DingTalk)',
      lark: '飞书 (Lark)',
      slack: 'Slack',
      ms_teams: '微软团队 (Teams)',
      telegram: '电报 (Telegram)',
      discord: 'Discord',
      custom: '自定义',
    },
    providerDocs: {
      title: '服务商配置文档',
      label: '文档链接',
    },
  },
  requests: {
    navActionsExtra: {
      filter: {
        select: {
          setting: {
            label: '通知配置',
          },
          channel: {
            label: '通知渠道',
          },
        },
      },
    },
    form: {
      setting: '通知设置',
      channel: '通知渠道',
      status: '状态',
      error: '错误信息',
      createdAt: '通知时间',
      title: '标题',
      content: '内容',
      senderEmail: '发件人邮箱',
      senderName: '发件人姓名',
      mailTo: '发送至 (To)',
      mailCc: '抄送 (CC)',
      mailBcc: '密送 (BCC)',
    },
    detail: {
      title: '通知请求详情',
    },
  },
  alerts: {
    navActions: {
      new: {
        label: '新建通知警报',
        tooltip: '创建一个新的通知警报',
      },
      filter: {
        search: {
          placeholder: '搜索通知警报',
        },
      },
    },
    form: {
      name: '名称',
      description: '描述',
      enabled: '是否启用',
      hasMetricTarget: '是否有指标目标',
      metricTarget: '指标目标',
      alertRule: '警报规则',
      metricName: '指标名称',
      operator: '操作符',
      lastingDuration: '持续时间',
      targetValue: '目标值',
      level: '级别',
    },
    lastingDuration: {
      '1m': '1 分钟 (即时)',
      '5m': '5 分钟',
      '10m': '10 分钟',
      '30m': '30 分钟',
      '1h': '1 小时',
    },
    levels: {
      info: '信息',
      warning: '警告',
      critical: '严重',
    },
  },
  message: {
    success: {
      create: {
        alert: '通知警报创建成功',
      },
      sendTestMessage: '发送测试消息成功',
    },
  },
  messageBox: {
    confirm: {
      sendTestMessage: '您是否确定发送测试消息?',
    },
    prompt: {
      sendTestMessage: {
        title: '请填写需要发送测试消息的邮箱地址',
        placeholder: '邮箱地址',
      },
    },
  },
};

export default notification;
