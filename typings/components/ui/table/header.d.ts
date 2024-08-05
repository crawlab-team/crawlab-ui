declare const useHeader: (emit: Function) => {
  onHeaderChange: (
    column: TableColumn,
    sort: SortData,
    filter?: FilterConditionData[]
  ) => void;
};
export default useHeader;
