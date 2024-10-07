const metric: LComponentsMetric = {
  select: {
    placeholder: 'Select Metric',
  },
  metrics: {
    cpu_usage_percent: 'CPU Usage (%)',
    total_memory: 'Total Memory',
    available_memory: 'Available Memory',
    used_memory: 'Used Memory',
    used_memory_percent: 'Used Memory (%)',
    total_disk: 'Total Disk',
    available_disk: 'Available Disk',
    used_disk: 'Used Disk',
    used_disk_percent: 'Used Disk (%)',
    disk_read_bytes_rate: 'Disk Read IO',
    disk_write_bytes_rate: 'Disk Write IO',
    network_bytes_sent_rate: 'Network Sent IO',
    network_bytes_recv_rate: 'Network Recv IO',
    connections: 'Connections',
    query_per_second: 'Queries/sec',
    cache_hit_ratio: 'Cache Hit Ratio',
    replication_lag: 'Replication Lag',
    lock_wait_time: 'Lock Wait Time',
  },
  groups: {
    disk_io_bytes_rate: 'Disk IO',
    network_io_bytes_rate: 'Network IO',
  },
  timeUnits: {
    s: 'sec',
    m: 'min',
    h: 'hr',
    d: 'd',
    w: 'wk',
    M: 'mon',
    y: 'yr',
  },
  timeRanges: {
    '1h': 'Past 1 Hour',
    '24h': 'Past 24 Hours',
    '7d': 'Past 7 Days',
    '30d': 'Past 30 Days',
  },
  noData: {
    label: 'No Data',
    tooltip: 'No recent monitoring data available for this node',
  },
  unavailable: {
    chart: 'This metric is unavailable',
    option: 'Unavailable',
  },
};

export default metric;
