import { translate } from '@/utils/i18n';

const t = translate;

const formatValue = (value: number, sizes: string[], decimal?: number) => {
  const i = Math.max(0, Math.floor(Math.log(value) / Math.log(1000)));
  const formattedValue = decimal
    ? (value / Math.pow(1000, i)).toFixed(decimal)
    : Math.round(value / Math.pow(1000, i)); // Ensure division result is a number
  return formattedValue + sizes[i];
};

export const formatBytes = (bytes?: number, decimal?: number) => {
  if (!bytes) return '0 Byte';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  return formatValue(bytes, sizes, decimal);
};

export const formatNumber = (value?: number, decimal?: number) => {
  if (!value) return '0';
  const sizes = ['', 'k', 'm', 'b', 't'];
  return formatValue(value, sizes, decimal);
};

export const formatDuration = (value?: number, decimal?: number) => {
  if (!value) return '0';
  const sizes = ['ms', 's', 'm', 'h'];
  return formatValue(value, sizes, decimal);
};

export const getAllMetricGroups = (): MetricGroup[] => [
  {
    name: 'cpu_usage_percent', // 'cpu_usage_percent
    label: t('components.metric.metrics.cpu_usage_percent'),
    metrics: ['cpu_usage_percent'],
  },
  {
    name: 'used_memory_percent',
    label: t('components.metric.metrics.used_memory_percent'),
    metrics: ['used_memory_percent'],
  },
  {
    name: 'used_disk_percent',
    label: t('components.metric.metrics.used_disk_percent'),
    metrics: ['used_disk_percent'],
  },
  {
    name: 'disk_io_bytes_rate',
    label: t('components.metric.groups.disk_io_bytes_rate'),
    metrics: ['disk_read_bytes_rate', 'disk_write_bytes_rate'],
  },
  {
    name: 'network_io_bytes_rate',
    label: t('components.metric.groups.network_io_bytes_rate'),
    metrics: ['network_bytes_recv_rate', 'network_bytes_sent_rate'],
  },
  {
    name: 'total_memory',
    label: t('components.metric.metrics.total_memory'),
    metrics: ['total_memory'],
  },
  {
    name: 'available_memory',
    label: t('components.metric.metrics.available_memory'),
    metrics: ['available_memory'],
  },
  {
    name: 'used_memory',
    label: t('components.metric.metrics.used_memory'),
    metrics: ['used_memory'],
  },
  {
    name: 'total_disk',
    label: t('components.metric.metrics.total_disk'),
    metrics: ['total_disk'],
  },
  {
    name: 'available_disk',
    label: t('components.metric.metrics.available_disk'),
    metrics: ['available_disk'],
  },
  {
    name: 'used_disk',
    label: t('components.metric.metrics.used_disk'),
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

export const getMetricFormatValue = (
  metricGroup: MetricGroup,
  value: number
): string => {
  const { name, format, formatDecimal } = metricGroup;
  if (typeof format === 'function') {
    return format(value);
  } else if (typeof format === 'string') {
    switch (format) {
      case 'percent':
        return (
          (Math.round(value * 100) / 100).toFixed(formatDecimal || 0) + '%'
        );
      case 'number':
        return formatNumber(value, formatDecimal);
      case 'bytes':
        return formatBytes(value, formatDecimal);
      case 'duration':
        return formatDuration(value, formatDecimal);
      default:
        return value.toString();
    }
  } else if (name?.match(/(percent|ratio)$/)) {
    return Math.round(value) + '%';
  } else if (name?.match(/(rate)$/)) {
    return formatBytes(value) + ' / ' + t('components.metric.timeUnits.s');
  } else {
    return formatNumber(value);
  }
};
