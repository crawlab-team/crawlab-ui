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
  triggers: {
    taskTrigger: 'Task Trigger',
    taskTriggerFinish: 'Trigger when the task finishes',
    taskTriggerError: 'Trigger when the task fails',
    taskTriggerEmptyResults: 'Trigger when the task has empty results',
    taskTriggerNever: 'Never trigger',
  },
  tabs: {
    overview: 'Overview',
    triggers: 'Triggers',
    template: 'Template',
  },
};

export default notification;
