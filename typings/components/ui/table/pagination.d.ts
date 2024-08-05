declare const usePagination: (
  props: TableProps,
  emit: Function
) => {
  onCurrentChange: (page: number) => void;
  onSizeChange: (size: number) => void;
};
export default usePagination;
