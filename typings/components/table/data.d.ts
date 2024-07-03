declare const useData: (data: TableData) => {
    tableData: import("@vue/reactivity").ComputedRef<TableData<TableAnyRowData>>;
};
export default useData;
