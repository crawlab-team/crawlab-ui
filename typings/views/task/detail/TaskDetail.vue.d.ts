declare const _default: import("@vue/runtime-core").DefineComponent<{}, {
    form: import("@vue/reactivity").ComputedRef<BaseModel>;
    navItems: import("@vue/reactivity").ComputedRef<NavItem<BaseModel>[]>;
    activeId: import("@vue/reactivity").ComputedRef<string>;
    navSidebar: import("@vue/reactivity").Ref<{
        scroll: (id: string) => void;
    } | null>;
    navActions: import("@vue/reactivity").Ref<{
        getHeight: () => string;
    } | null>;
    showActionsToggleTooltip: import("@vue/reactivity").Ref<boolean>;
    tabs: import("@vue/reactivity").ComputedRef<{
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
    }[]>;
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
}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
