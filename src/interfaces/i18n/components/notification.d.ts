interface LComponentsNotification {
  trigger: {
    label: string;
    tooltip: string;
    target: {
      label: string;
      change: {
        label: string;
        note: string;
      };
    };
    targets: {
      task: string;
      node: string;
    };
  };
  template: {
    mode: {
      change: {
        label: string;
        note: string;
      };
    };
    modes: {
      richText: string;
      markdown: string;
    };
  };
}
