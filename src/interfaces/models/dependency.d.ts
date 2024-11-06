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

  type DependencyStatus =
    | 'installing'
    | 'installed'
    | 'uninstalling'
    | 'uninstalled'
    | 'error'
    | 'abnormal';

  interface Dependency extends BaseModel {
    node_id?: string;
    type?: string;
    name?: string;
    version?: string;
    latest_version?: string;
    description?: string;
    status?: DependencyStatus;
    error?: string;
  }

  interface DependencyRepo {
    name?: string;
    node_ids?: string[];
    versions?: string[];
    latest_version?: string;
    type?: DependencyLang;
    dependencies?: Dependency[];
  }

  type DependencyRepoTabName = 'installed' | 'search';

  interface DependencyLog extends BaseModel {
    dependency_id?: string;
    content?: string;
  }

  interface DependencyInstallForm {
    mode?: 'all' | 'selected-nodes';
    name?: string;
    version?: string;
    node_ids?: string[];
    nodes?: CNode[];
  }

  interface DependencyUninstallForm {
    mode?: string;
    names?: string[];
    node_ids?: string[];
    nodes?: CNode[];
  }

  type DependencyLang = 'python' | 'node';
}
