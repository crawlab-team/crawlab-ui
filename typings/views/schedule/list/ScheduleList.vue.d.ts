declare const _default: import("@vue/runtime-core").DefineComponent<{
    noActions: {
        type: BooleanConstructor;
        default: boolean;
    };
    embedded: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    navActions: import("@vue/reactivity").Ref<ListActionGroup[]> | undefined;
    tableColumns: import("@vue/reactivity").Ref<TableColumns<any>> | undefined;
    tableData: import("@vue/reactivity").Ref<TableData<any>>;
    tableTotal: import("@vue/reactivity").Ref<number>;
    tablePagination: import("@vue/reactivity").Ref<TablePagination>;
    actionFunctions: ListLayoutActionFunctions;
}, unknown, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<{
    noActions: {
        type: BooleanConstructor;
        default: boolean;
    };
    embedded: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    noActions: boolean;
    embedded: boolean;
}, {}>;
export default _default;
