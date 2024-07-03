declare const _default: import("@vue/runtime-core").DefineComponent<{
    type: {
        type: StringConstructor;
    };
}, {
    dialogVisible: import("@vue/reactivity").Ref<{
        logs: boolean;
    }>;
    tableColumns: import("@vue/reactivity").ComputedRef<TableColumns<EnvDepsTask>>;
    tableData: import("@vue/reactivity").Ref<{
        [x: string]: any;
        status?: string;
        error?: string;
        setting_id?: string;
        type?: string;
        node_id?: string;
        action?: string;
        dep_names?: string[];
        upgrade?: boolean;
        update_ts?: string;
        _id?: string;
    }[]>;
    tablePagination: import("@vue/reactivity").Ref<{
        page: number;
        size: number;
    }>;
    tableTotal: import("@vue/reactivity").Ref<number>;
    onPaginationChange: (pagination: TablePagination) => void;
    getList: () => Promise<void>;
    logs: import("@vue/reactivity").Ref<{
        [x: string]: any;
        task_id?: string;
        content?: string;
        update_ts?: string;
        _id?: string;
    }[]>;
    onLogsClose: () => void;
    t: (path: string, number?: any, args?: Record<string, any>) => string;
}, unknown, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<{
    type: {
        type: StringConstructor;
    };
}>>, {}, {}>;
export default _default;
