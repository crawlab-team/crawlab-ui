declare const _default: import("vue").DefineComponent<{
    type: {
        type: StringConstructor;
    };
}, {
    dialogVisible: import("vue").Ref<{
        logs: boolean;
    }>;
    tableColumns: import("vue").ComputedRef<TableColumns<EnvDepsTask>>;
    tableData: import("vue").Ref<{
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
    tablePagination: import("vue").Ref<{
        page: number;
        size: number;
    }>;
    tableTotal: import("vue").Ref<number>;
    onPaginationChange: (pagination: TablePagination) => void;
    getList: () => Promise<void>;
    logs: import("vue").Ref<{
        [x: string]: any;
        task_id?: string;
        content?: string;
        update_ts?: string;
        _id?: string;
    }[]>;
    onLogsClose: () => void;
    t: (path: string, number?: any, args?: Record<string, any>) => string;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    type: {
        type: StringConstructor;
    };
}>>, {}, {}>;
export default _default;
