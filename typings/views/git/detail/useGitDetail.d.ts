declare const useGitDetail: () => {
  currentBranch: import('vue').ComputedRef<GitRef | undefined>;
  gitLocalBranches: import('vue').ComputedRef<GitRef[]>;
  gitLocalBranchesDict: import('vue').ComputedRef<Record<string, GitRef>>;
  gitRemoteBranches: import('vue').ComputedRef<GitRef[] | undefined>;
  gitRemoteBranchesDict: import('vue').ComputedRef<Record<string, GitRef>>;
  isDisabled: import('vue').ComputedRef<boolean>;
  commitLoading: import('vue').Ref<boolean>;
  onCommit: () => Promise<void>;
  rollbackLoading: import('vue').Ref<boolean>;
  onRollback: () => Promise<void>;
  pullLoading: import('vue').Ref<boolean>;
  pullBoxVisible: import('vue').Ref<boolean>;
  pullBoxLogs: import('vue').Ref<string[]>;
  onPull: () => Promise<void>;
  pushLoading: import('vue').Ref<boolean>;
  pushBoxVisible: import('vue').Ref<boolean>;
  pushBoxLogs: import('vue').Ref<string[]>;
  onPush: () => Promise<void>;
  navItems: import('vue').ComputedRef<NavItem<BaseModel>[]>;
  activeId: import('vue').ComputedRef<string>;
  navSidebar: import('vue').Ref<{
    scroll: (id: string) => void;
  } | null>;
  navActions: import('vue').Ref<{
    getHeight: () => string;
  } | null>;
  showActionsToggleTooltip: import('vue').Ref<boolean>;
  tabs: import('vue').ComputedRef<
    {
      title: string;
      disabled: boolean;
      id: string;
      subtitle?: string;
      data?: any;
      icon?: string[] | string;
      tooltip?: string;
      emphasis?: boolean;
      style?: any;
      badge?: string | number;
      badgeType?: BasicType;
      label?: string;
      value?: any;
      children?: NavItem<any>[] | undefined;
      path?: string;
    }[]
  >;
  activeTabName: import('vue').ComputedRef<string>;
  sidebarCollapsed: import('vue').ComputedRef<boolean>;
  actionsCollapsed: import('vue').ComputedRef<boolean>;
  contentContainerStyle: import('vue').ComputedRef<{
    height: string;
  }>;
  getForm: () => Promise<Promise<any>>;
  onNavSidebarSelect: (item: NavItem) => Promise<void>;
  onNavSidebarToggle: (value: boolean) => void;
  onActionsToggle: () => void;
  onNavTabsSelect: (tabName: string) => Promise<void>;
  onNavTabsToggle: () => void;
  onBack: () => Promise<void>;
  onSave: () => Promise<void>;
};
export default useGitDetail;
