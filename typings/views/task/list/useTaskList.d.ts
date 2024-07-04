declare const useTaskList: () => {
    navActions?: import("vue").Ref<ListActionGroup[]>;
    tableColumns?: import("vue").Ref<TableColumns<any>> | undefined;
    tableData: import("vue").Ref<TableData<any>>;
    tableTotal: import("vue").Ref<number>;
    tablePagination: import("vue").Ref<TablePagination>;
    tableListFilter: import("vue").Ref<FilterConditionData[]>;
    tableListSort: import("vue").Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: import("vue").ComputedRef<DialogKey | undefined>;
};
export default useTaskList;
