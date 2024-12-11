interface LComponentsNode {
  form: {
    key: string;
    name: string;
    type: string;
    ip: string;
    mac: string;
    hostname: string;
    enabled: string;
    maxRunners: string;
    description: string;
    status: string;
  };
  nodeType: {
    label: {
      master: string;
      worker: string;
    };
  };
  nodeStatus: {
    label: {
      online: string;
      offline: string;
      unknown: string;
    };
    tooltip: {
      unregistered: string;
      registered: string;
      online: string;
      offline: string;
      unknown: string;
    };
  };
  nodeRunners: {
    tooltip: {
      unavailable: string;
      running: string;
      available: string;
    };
  };
}
