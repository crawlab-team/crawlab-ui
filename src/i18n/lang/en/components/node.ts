const node: LComponentsNode = {
  form: {
    key: 'Unique Identity Key',
    name: 'Name',
    tags: 'Tags',
    type: 'Type',
    ip: 'IP',
    mac: 'MAC Address',
    hostname: 'Hostname',
    enabled: 'Enabled',
    max_runners: 'Max Runners',
    description: 'Description',
  },
  nodeType: {
    label: {
      master: 'Master',
      worker: 'Worker',
    },
  },
  nodeStatus: {
    label: {
      unregistered: 'Unregistered',
      registered: 'Registered',
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
  metric: {
    select: {
      placeholder: 'Select Metric',
    },
    metrics: {
      cpu_usage_percent: 'CPU Usage (%)',
      total_memory: 'Total Memory (bytes)',
      available_memory: 'Available Memory (bytes)',
      used_memory: 'Used Memory (bytes)',
      used_memory_percent: 'Used Memory (%)',
      total_disk: 'Total Disk (bytes)',
      available_disk: 'Available Disk (bytes)',
      used_disk: 'Used Disk (bytes)',
      used_disk_percent: 'Used Disk (%)',
      disk_read_bytes_rate: 'Disk Read IO (bytes/sec)',
      disk_write_bytes_rate: 'Disk Write IO (bytes/sec)',
      network_bytes_sent_rate: 'Network Sent IO (bytes/sec)',
      network_bytes_recv_rate: 'Network Recv IO (bytes/sec)',
    },
    timeRanges: {
      '1h': '1 Hour',
      '1d': '1 Day',
      '7d': '7 Days',
      '30d': '30 Days',
    },
  },
};

export default node;
