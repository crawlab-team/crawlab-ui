const node: LComponentsNode = {
  form: {
    key: '唯一标识',
    name: '名称',
    tags: '标签',
    type: '类别',
    ip: 'IP',
    mac: 'MAC 地址',
    hostname: '主机名',
    enabled: '是否启用',
    max_runners: '最大执行器数',
    description: '描述',
  },
  nodeType: {
    label: {
      master: '主节点',
      worker: '工作节点',
    },
  },
  nodeStatus: {
    label: {
      unregistered: '未注册',
      registered: '已注册',
      online: '在线',
      offline: '离线',
      unknown: '未知',
    },
    tooltip: {
      unregistered: '节点正在等待注册',
      registered: '节点已注册，正在等待在线',
      online: '节点处于在线状态',
      offline: '节点处于离线状态',
      unknown: '未知节点状态',
    },
  },
  nodeRunners: {
    tooltip: {
      unavailable: '目前没有可用执行器',
      running: '总共 {max} 个执行器中的 {running} 个正在运行',
      available: '所有执行器均可用',
    },
  },
  metric: {
    select: {
      placeholder: '选择指标',
    },
    metrics: {
      cpu_usage_percent: 'CPU 使用率 (%)',
      total_memory: '总内存 (字节)',
      available_memory: '可用内存 (字节)',
      used_memory: '已用内存 (字节)',
      used_memory_percent: '已用内存 (%)',
      total_disk: '总磁盘 (字节)',
      available_disk: '可用磁盘 (字节)',
      used_disk: '已用磁盘 (字节)',
      used_disk_percent: '已用磁盘 (%)',
      disk_read_bytes_rate: '磁盘读取 IO (字节/秒)',
      disk_write_bytes_rate: '磁盘写入 IO (字节/秒)',
      network_bytes_sent_rate: '网络发送 IO (字节/秒)',
      network_bytes_recv_rate: '网络接收 IO (字节/秒)',
    },
    timeRanges: {
      '1h': '1 小时',
      '1d': '1 天',
      '7d': '7 天',
      '30d': '30 天',
    },
  },
};

export default node;
