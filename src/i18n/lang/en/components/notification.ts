const notification: LComponentsNotification = {
  trigger: {
    label: 'Trigger',
    tooltip: 'Notification trigger settings',
    target: {
      label: 'Trigger Target',
      change: {
        label: 'Change Trigger Target',
        note: 'Note: Changing the trigger target may cause variables unavailable in the template',
      },
    },
    targets: {
      task: 'Task',
      node: 'Node',
    },
  },
  template: {
    mode: {
      change: {
        label: 'Change Edit Mode',
        note: 'Note: Changing the edit mode may cause style or content loss',
      },
    },
    modes: {
      richText: 'Rich Text',
      markdown: 'Markdown',
    },
  },
};

export default notification;
