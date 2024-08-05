export declare const formatBytes: (bytes?: number) => string;
export declare const getAllMetricGroups: () => MetricGroup[];
export declare const getMetricUnitLabel: (
  metricName: string
) => 'MB' | 'GB' | '%' | 'MB/s';
