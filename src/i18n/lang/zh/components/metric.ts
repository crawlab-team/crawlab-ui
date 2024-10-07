const metric: LComponentsMetric = {
  select: {
    placeholder: '选择指标',
  },
  metrics: {
    cpu_usage_percent: 'CPU 使用率 (%)',
    total_memory: '总内存',
    available_memory: '可用内存',
    used_memory: '已用内存',
    used_memory_percent: '已用内存 (%)',
    total_disk: '总磁盘',
    available_disk: '可用磁盘',
    used_disk: '已用磁盘',
    used_disk_percent: '已用磁盘 (%)',
    disk_read_bytes_rate: '磁盘读取 IO',
    disk_write_bytes_rate: '磁盘写入 IO',
    network_bytes_sent_rate: '网络发送 IO',
    network_bytes_recv_rate: '网络接收 IO',
    connections: '连接数',
    query_per_second: '查询数/秒',
    cache_hit_ratio: '缓存命中率',
    replication_lag: '复制延迟',
    lock_wait_time: '锁等待时间',
  },
  groups: {
    disk_io_bytes_rate: '磁盘 IO',
    network_io_bytes_rate: '网络 IO',
  },
  timeUnits: {
    s: '秒',
    m: '分',
    h: '小时',
    d: '天',
    w: '周',
    M: '月',
    y: '年',
  },
  timeRanges: {
    '1h': '过去 1 小时',
    '24h': '过去 24 小时',
    '7d': '过去 7 天',
    '30d': '过去 30 天',
  },
  noData: {
    label: '无数据',
    tooltip: '该节点暂无最近的监控数据',
  },
  unavailable: {
    chart: '该指标不可用',
    option: '不可用',
  },
};

export default metric;
