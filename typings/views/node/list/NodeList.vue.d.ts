declare const _default: import("@vue/runtime-core").DefineComponent<{}, {
    visibleButtons: any[];
    navActions?: import("@vue/reactivity").Ref<ListActionGroup[]>;
    tableColumns?: import("@vue/reactivity").Ref<TableColumns<any>> | undefined;
    tableData: import("@vue/reactivity").Ref<TableData<any>>;
    tableTotal: import("@vue/reactivity").Ref<number>;
    tablePagination: import("@vue/reactivity").Ref<TablePagination>;
    tableListFilter: import("@vue/reactivity").Ref<FilterConditionData[]>;
    tableListSort: import("@vue/reactivity").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("@vue/reactivity").ComputedRef<DialogKey | undefined>;
}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
