<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import useRequest from '@/services/request';

const props = defineProps<{
  loading?: boolean;
  activeTable?: DatabaseTable;
  activeId?: string;
  databaseName?: string;
}>();

const { getList } = useRequest();

const tableColumns = computed<TableColumns>(() => {
  const { columns } = props.activeTable || {};
  if (!columns) return [];
  return columns.map(c => {
    return {
      label: c.name,
      key: c.name,
    } as TableColumn;
  });
});
const tableData = ref<TableData>([]);
const tablePagination = ref<TablePagination>({
  page: 1,
  size: 10,
});
const tableTotal = ref(0);

const getTableData = async () => {
  const res = await getList(`/databases/${props.activeId}/tables/data`, {
    database: props.databaseName,
    table: props.activeTable?.name,
    page: tablePagination.value.page,
    size: tablePagination.value.size,
  });
  tableData.value = res.data || [];
  tableTotal.value = res.total || 0;
};
onBeforeMount(getTableData);
watch(() => props.activeTable, getTableData);

const onPaginationChange = (pagination: TablePagination) => {
  tablePagination.value = pagination;
};
watch(tablePagination, getTableData);

defineOptions({ name: 'ClDatabaseTableDetailData' });
</script>

<template>
  <cl-edit-table
    :key="JSON.stringify(props.activeTable)"
    :row-key="(row: TableAnyRowData) => JSON.stringify(row)"
    :columns="tableColumns"
    :data="tableData"
    :page="tablePagination.page"
    :page-size="tablePagination.size"
    :total="tableTotal"
    @pagination-change="onPaginationChange"
  />
</template>

<style scoped></style>
