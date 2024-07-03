declare const useScheduleList: () => {
    navActions?: import("@vue/reactivity").Ref<ListActionGroup[]>;
    tableColumns?: import("@vue/reactivity").Ref<TableColumns<any>> | undefined;
    tableData: import("@vue/reactivity").Ref<TableData<any>>;
    tableTotal: import("@vue/reactivity").Ref<number>;
    tablePagination: import("@vue/reactivity").Ref<TablePagination>;
    tableListFilter: import("@vue/reactivity").Ref<FilterConditionData[]>;
    tableListSort: import("@vue/reactivity").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("@vue/reactivity").ComputedRef<DialogKey | undefined>;
};
export default useScheduleList;
