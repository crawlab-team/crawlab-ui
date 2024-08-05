declare const useData: (data: TableData) => {
  tableData: import('vue').ComputedRef<TableData<TableAnyRowData>>;
};
export default useData;
