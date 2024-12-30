export declare global {
  interface DependencyConfig extends BaseModel {
    key?: string;
    name?: string;
    enabled?: boolean;
    exec_cmd?: string;
    pkg_cmd?: string;
    pkg_src_url?: string;
    setup?: boolean;
    search_ready?: boolean;
    total_dependencies?: number;
  }

  interface DependencyConfigSetup extends BaseModel {
    dependency_config_id?: string;
    node_id?: string;
    version?: string;
    status?: DependencyStatus;
    error?: string;
    node?: CNode;
  }

  type DependencyStatus =
    | 'installing'
    | 'installed'
    | 'uninstalling'
    | 'uninstalled'
    | 'error'
    | 'abnormal';

  type DependencyFileType = 'requirements.txt' | 'package.json';

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

  interface DependencyRequirement {
    name?: string;
    version?: string;
    dependencies?: Dependency[];
    latest_version?: string;
    type?: DependencyLang;
  }

  type DependencyRepoTabName = 'installed' | 'search' | 'nodes';

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
    mode?: 'all' | 'selected-nodes';
    names?: string[];
    node_ids?: string[];
    nodes?: CNode[];
  }

  interface DependencySetupForm {
    node_id?: string;
    version?: string;
    mode?: 'all' | 'selected-nodes';
    node_ids?: string[];
    nodes?: CNode[];
  }

  type DependencyLang = 'python' | 'node' | 'go' | 'java' | 'browser';
}
