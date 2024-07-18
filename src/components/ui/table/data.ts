import { computed } from 'vue';

const useData = (data: TableData) => {
  const tableData = computed(() => {
    return data;
  });

  return {
    tableData,
  };
};

export default useData;
