const usePagination = (props: TableProps, emit: Function) => {
  const onCurrentChange = (page: number) => {
    const { pageSize } = props;
    emit('pagination-change', {
      page,
      size: pageSize,
    } as TablePagination);
  };

  const onSizeChange = (size: number) => {
    const { page } = props;
    emit('pagination-change', {
      page,
      size,
    } as TablePagination);
  };

  return {
    onCurrentChange,
    onSizeChange,
  };
};

export default usePagination;
