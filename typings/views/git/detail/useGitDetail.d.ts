declare const useGitDetail: () => {
    tabs: import("@vue/reactivity").ComputedRef<NavItem<any>[]>;
    currentBranch: import("@vue/reactivity").ComputedRef<GitRef | undefined>;
    gitLocalBranches: import("@vue/reactivity").ComputedRef<GitRef[]>;
    gitLocalBranchesDict: import("@vue/reactivity").ComputedRef<Record<string, GitRef>>;
    gitRemoteBranches: import("@vue/reactivity").ComputedRef<GitRef[] | undefined>;
    gitRemoteBranchesDict: import("@vue/reactivity").ComputedRef<Record<string, GitRef>>;
    isDisabled: import("@vue/reactivity").ComputedRef<boolean>;
    commitLoading: import("@vue/reactivity").Ref<boolean>;
    onCommit: () => Promise<void>;
    rollbackLoading: import("@vue/reactivity").Ref<boolean>;
    onRollback: () => Promise<void>;
    pullLoading: import("@vue/reactivity").Ref<boolean>;
    pullBoxVisible: import("@vue/reactivity").Ref<boolean>;
    pullBoxLogs: import("@vue/reactivity").Ref<string[]>;
    onPull: () => Promise<void>;
    pushLoading: import("@vue/reactivity").Ref<boolean>;
    pushBoxVisible: import("@vue/reactivity").Ref<boolean>;
    pushBoxLogs: import("@vue/reactivity").Ref<string[]>;
    onPush: () => Promise<void>;
    navItems: import("@vue/reactivity").ComputedRef<NavItem<BaseModel>[]>;
    activeId: import("@vue/reactivity").ComputedRef<string>;
    navSidebar: import("@vue/reactivity").Ref<{
        scroll: (id: string) => void;
    } | null>;
    navActions: import("@vue/reactivity").Ref<{
        getHeight: () => string;
    } | null>;
    showActionsToggleTooltip: import("@vue/reactivity").Ref<boolean>;
    activeTabName: import("@vue/reactivity").ComputedRef<string>;
    sidebarCollapsed: import("@vue/reactivity").ComputedRef<boolean>;
    actionsCollapsed: import("@vue/reactivity").ComputedRef<boolean>;
    contentContainerStyle: import("@vue/reactivity").ComputedRef<{
        height: string;
    }>;
    getForm: () => ReturnType<() => Promise<any>> extends Promise<any> ? Promise<ReturnType<() => Promise<any>>> : ReturnType<() => Promise<any>>;
    onNavSidebarSelect: (item: NavItem) => Promise<void>;
    onNavSidebarToggle: (value: boolean) => void;
    onActionsToggle: () => void;
    onNavTabsSelect: (tabName: string) => Promise<void>;
    onNavTabsToggle: () => void;
    onBack: () => Promise<void>;
    onSave: () => Promise<void>;
};
export default useGitDetail;
