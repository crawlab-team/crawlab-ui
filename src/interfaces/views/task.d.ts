import {
  TASK_MODE_ALL_NODES,
  TASK_MODE_RANDOM,
  TASK_MODE_SELECTED_NODES,
} from '@/constants/task';

export declare global {
  interface Task extends BaseModel {
    spider_id?: string;
    spider_name?: string;
    status?: TaskStatus;
    node_id?: string;
    node_name?: string;
    pid?: number;
    schedule_id?: string;
    schedule_name?: string;
    type?: string;
    mode?: TaskMode;
    parent_id?: string;
    cmd?: string;
    param?: string;
    error?: string;
    stat?: TaskStat;
    priority?: number;

    // view model
    spider?: Spider;
  }

  interface TaskStat {
    create_ts?: string;
    start_ts?: string;
    end_ts?: string;
    result_count?: number;
    error_log_count?: number;
    wait_duration?: number;
    runtime_duration?: number;
    total_duration?: number;
  }

  type TaskMode =
    | TASK_MODE_RANDOM
    | TASK_MODE_ALL_NODES
    | TASK_MODE_SELECTED_NODES;

  type TaskStatus =
    | 'abnormal'
    | 'cancelled'
    | 'error'
    | 'finished'
    | 'running'
    | 'pending';
}
