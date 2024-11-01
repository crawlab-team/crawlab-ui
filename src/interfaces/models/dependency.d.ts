export declare global {
  interface DependencySetting extends BaseModel {
    key?: string;
    name?: string;
    description?: string;
    enabled?: boolean;
    cmd?: string;
    proxy?: string;
    last_update_ts?: string;
  }

  interface DependencyTask extends BaseModel {
    status?: string;
    error?: string;
    setting_id?: string;
    type?: string;
    node_id?: string;
    action?: string;
    dep_names?: string[];
  }

  interface Dependency extends BaseModel {
    node_id?: string;
    type?: string;
    name?: string;
    version?: string;
    latest_version?: string;
    description?: string;
    result?: DependencyResult;
  }

  interface DependencyResult {
    name?: string;
    node_ids?: string[];
    versions?: string[];
    latest_version?: string;
    count?: number;
    upgradable?: boolean;
    downgradable?: boolean;
    installable?: boolean;
  }

  interface DependencyLog extends BaseModel {
    task_id?: string;
    content?: string;
  }

  interface DependencyInstallPayload {
    mode?: string;
    names: string[];
    version?: string;
    node_ids?: string[];
    nodes?: CNode[];
  }

  interface DependencyUninstallPayload {
    mode?: string;
    names?: string[];
    node_ids?: string[];
    nodes?: CNode[];
  }
}
