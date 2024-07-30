import { translate } from '@/utils/i18n';

const t = translate;

export const formatBytes = (bytes?: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

export const getAllMetricGroups = (): MetricGroup[] => [
  {
    name: 'cpu_usage_percent', // 'cpu_usage_percent
    label: t('components.node.metric.metrics.cpu_usage_percent'),
    metrics: ['cpu_usage_percent'],
  },
  {
    name: 'used_memory_percent',
    label: t('components.node.metric.metrics.used_memory_percent'),
    metrics: ['used_memory_percent'],
  },
  {
    name: 'used_disk_percent',
    label: t('components.node.metric.metrics.used_disk_percent'),
    metrics: ['used_disk_percent'],
  },
  {
    name: 'disk_io_bytes_rate',
    label: t('components.node.metric.groups.disk_io_bytes_rate'),
    metrics: ['disk_read_bytes_rate', 'disk_write_bytes_rate'],
  },
  {
    name: 'network_io_bytes_rate',
    label: t('components.node.metric.groups.network_io_bytes_rate'),
    metrics: ['network_bytes_recv_rate', 'network_bytes_sent_rate'],
  },
  {
    name: 'total_memory',
    label: t('components.node.metric.metrics.total_memory'),
    metrics: ['total_memory'],
  },
  {
    name: 'available_memory',
    label: t('components.node.metric.metrics.available_memory'),
    metrics: ['available_memory'],
  },
  {
    name: 'used_memory',
    label: t('components.node.metric.metrics.used_memory'),
    metrics: ['used_memory'],
  },
  {
    name: 'total_disk',
    label: t('components.node.metric.metrics.total_disk'),
    metrics: ['total_disk'],
  },
  {
    name: 'available_disk',
    label: t('components.node.metric.metrics.available_disk'),
    metrics: ['available_disk'],
  },
  {
    name: 'used_disk',
    label: t('components.node.metric.metrics.used_disk'),
    metrics: ['used_disk'],
  },
];

export const getMetricUnitLabel = (metricName: string) => {
  if (metricName.endsWith('_percent')) {
    return '%';
  } else if (metricName.endsWith('_rate')) {
    return 'MB/s';
  } else if (metricName.endsWith('_disk')) {
    return 'GB';
  } else if (metricName.endsWith('_memory')) {
    return 'MB';
  } else {
    return 'MB';
  }
};
