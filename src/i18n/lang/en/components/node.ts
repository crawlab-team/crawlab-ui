const node: LComponentsNode = {
  form: {
    key: 'Unique Identity Key',
    name: 'Name',
    type: 'Type',
    ip: 'IP',
    mac: 'MAC Address',
    hostname: 'Hostname',
    enabled: 'Enabled',
    maxRunners: 'Max Runners',
    description: 'Description',
    status: 'Status',
  },
  nodeType: {
    label: {
      master: 'Master',
      worker: 'Worker',
    },
  },
  nodeStatus: {
    label: {
      online: 'Online',
      offline: 'Offline',
      unknown: 'Unknown',
    },
    tooltip: {
      unregistered: 'Node is waiting to be registered',
      registered: 'Node is registered and wait to be online',
      online: 'Node is currently online',
      offline: 'Node is currently offline',
      unknown: 'Unknown node status',
    },
  },
  nodeRunners: {
    tooltip: {
      unavailable: 'No runners available at this moment',
      running: '{running} out of {max} runners are running',
      available: 'All runners available',
    },
  },
};

export default node;
