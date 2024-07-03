interface LComponentsNode {
  form: {
    key: string;
    name: string;
    tags: string;
    type: string;
    ip: string;
    mac: string;
    hostname: string;
    enabled: string;
    max_runners: string;
    description: string;
  };
  nodeType: {
    label: {
      master: string;
      worker: string;
    };
  };
  nodeStatus: {
    label: {
      unregistered: string;
      registered: string;
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
  metric: {
    select: {
      placeholder: string;
    };
    metrics: {
      cpu_usage_percent: string;
      total_memory: string;
      available_memory: string;
      used_memory: string;
      used_memory_percent: string;
      total_disk: string;
      available_disk: string;
      used_disk: string;
      used_disk_percent: string;
      disk_read_bytes_rate: string;
      disk_write_bytes_rate: string;
      network_bytes_sent_rate: string;
      network_bytes_recv_rate: string;
    };
    timeRanges: {
      '1h': string;
      '1d': string;
      '7d': string;
      '30d': string;
    };
  };
}
