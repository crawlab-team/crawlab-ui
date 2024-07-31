export declare global {
  interface Metric {
    _id?: string;
    type?: string;
    node_id?: string;
    cpu_usage_percent?: number;
    total_memory?: number;
    available_memory?: number;
    used_memory?: number;
    used_memory_percent?: number;
    total_disk?: number;
    available_disk?: number;
    used_disk?: number;
    used_disk_percent?: number;
    disk_read_bytes_rate?: number;
    disk_write_bytes_rate?: number;
    network_bytes_sent_rate?: number;
    network_bytes_recv_rate?: number;
  }

  interface MetricGroup {
    name: string;
    label: string;
    metrics: (keyof Metric)[];
  }
}
