const notification: LViewsNotification = {
  navActions: {
    new: {
      label: 'New Notification',
      tooltip: 'Create a new notification',
    },
    filter: {
      search: {
        placeholder: 'Search notifications',
      },
    },
  },
  settings: {
    form: {
      name: 'Name',
      description: 'Description',
      type: 'Type',
      enabled: 'Enabled',
      title: 'Title',
      template: 'Template',
      templateContent: 'Template Content',
      triggerTarget: 'Trigger Target',
      trigger: 'Trigger',
      mail: {
        smtp: {
          server: 'SMTP Server',
          port: 'SMTP Port',
          user: 'SMTP User',
          password: 'SMTP Password',
          sender: {
            email: 'Sender Email',
            identity: 'Sender Identity',
          },
        },
        to: 'To',
        cc: 'CC',
      },
      mobile: {
        webhook: 'Webhook',
      },
    },
    type: {
      mail: 'Mail',
      mobile: 'Mobile',
    },
  },
  triggerTargets: {
    task: 'Task',
    node: 'Node',
  },
  triggers: {
    task: {
      finish: 'Trigger when the task finishes',
      error: 'Trigger when the task fails',
      emptyResults: 'Trigger when the task has empty results',
      never: 'Never trigger',
    },
    node: {
      statusChange: 'Trigger when the node status changes',
      online: 'Trigger when the node comes online',
      offline: 'Trigger when the node goes offline',
      never: 'Never trigger',
    },
  },
  tabs: {
    overview: 'Overview',
    triggers: 'Triggers',
    template: 'Template',
  },
};

export default notification;
