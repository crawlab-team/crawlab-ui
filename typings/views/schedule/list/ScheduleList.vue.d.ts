declare const _default: import("vue").DefineComponent<{
    noActions: {
        type: BooleanConstructor;
        default: boolean;
    };
    embedded: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    navActions: import("vue").Ref<ListActionGroup[]> | undefined;
    tableColumns: import("vue").Ref<TableColumns<any>> | undefined;
    tableData: import("vue").Ref<TableData<any>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    actionFunctions: ListLayoutActionFunctions;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
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
