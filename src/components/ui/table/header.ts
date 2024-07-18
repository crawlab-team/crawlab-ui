const useHeader = (emit: Function) => {
  const onHeaderChange = (
    column: TableColumn,
    sort: SortData,
    filter?: FilterConditionData[]
  ) => {
    emit('header-change', column, sort, filter);
  };

  return {
    // public variables and methods
    onHeaderChange,
  };
};

export default useHeader;
