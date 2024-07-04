export declare global {
  interface MetricGroup {
    name: string;
    label: string;
    metrics: keyof Metric[];
  }
}
