<script setup lang="ts">
defineOptions({ name: 'ClTable' });
import { inject, ref, computed } from 'vue';
import { ElTable } from 'element-plus';
import useColumn from '@/components/table/column';
import useHeader from '@/components/table/header';
import useAction from '@/components/table/action';
import usePagination from '@/components/table/pagination';
import {
  TABLE_PAGINATION_POSITION_ALL,
  TABLE_PAGINATION_POSITION_BOTTOM,
  TABLE_PAGINATION_POSITION_TOP,
} from '@/constants/table';
import { emptyArrayFunc } from '@/utils';

const props = withDefaults(
  defineProps<{
    data: TableData;
    columns: TableColumn[];
    selectedColumnKeys: string[];
    total: number;
    page: number;
    pageSize: number;
    rowKey: string | ((row: any) => string);
    selectable?: boolean;
    visibleButtons: BuiltInTableActionButtonName[];
    hideFooter?: boolean;
    selectableFunction?: TableSelectableFunction;
    paginationLayout: string;
    loading?: boolean;
    paginationPosition: TablePaginationPosition;
    height?: string | number;
    maxHeight?: string | number;
    embedded?: boolean;
    border?: boolean;
    fit?: boolean;
    emptyText?: string;
  }>(),
  {
    data: emptyArrayFunc,
    columns: emptyArrayFunc,
    selectedColumnKeys: emptyArrayFunc,
    total: 0,
    page: 1,
    pageSize: 10,
    rowKey: '_id',
    visibleButtons: emptyArrayFunc,
    paginationLayout: 'total, sizes, prev, pager, next',
    paginationPosition: TABLE_PAGINATION_POSITION_BOTTOM,
    border: true,
  }
);

const emit = defineEmits<{
  (e: 'edit', data: TableData): void;
  (e: 'delete', data: TableData): void;
  (e: 'export', data: TableData): void;
  (
    e: 'header-change',
    data: TableColumn,
    sort: SortData,
    filter: FilterConditionData[]
  ): void;
  (e: 'pagination-change', data: TablePagination): void;
  (e: 'selection-change', data: TableData): void;
}>();

const tableWrapperRef = ref();
const tableRef = ref();

const tableData = computed(() => props.data);

const {
  internalSelectedColumnKeys,
  columnsTransferVisible,
  selectedColumns,
  onShowColumnsTransfer,
  onHideColumnsTransfer,
  onColumnsChange,
} = useColumn(props, tableRef, tableWrapperRef);

const { onHeaderChange } = useHeader(emit);

// inject action functions
const actionFunctions = inject<ListLayoutActionFunctions>('action-functions');

const {
  selection: internalSelection,
  onSelectionChange,
  onEdit,
  onDelete,
  onExport,
  clearSelection,
} = useAction(emit, tableRef, actionFunctions as ListLayoutActionFunctions);

const { onCurrentChange, onSizeChange } = usePagination(props, emit);

const checkAll = () => {
  tableRef.value?.toggleRowSelection(true);
};

defineExpose({
  clearSelection,
  checkAll,
});
</script>

<template>
  <div
    v-loading="loading"
    ref="tableWrapperRef"
    :class="['table', embedded ? 'embedded' : ''].join(' ')"
  >
    <!-- Table Header -->
    <div class="table-header">
      <el-pagination
        v-if="
          [
            TABLE_PAGINATION_POSITION_ALL,
            TABLE_PAGINATION_POSITION_TOP,
          ].includes(paginationPosition)
        "
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        class="pagination"
        :layout="paginationLayout"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
    <!-- ./Table Header -->

    <!-- Table Body -->
    <el-table
      v-if="selectedColumns.length > 0"
      ref="tableRef"
      :data="tableData"
      :fit="fit"
      :row-key="rowKey"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :empty-text="emptyText"
      @selection-change="onSelectionChange"
    >
      <el-table-column
        v-if="selectable"
        align="center"
        reserve-selection
        type="selection"
        width="40"
        fixed="left"
      />
      <el-table-column
        v-for="c in selectedColumns"
        :key="c.key"
        :column-key="c.key"
        :align="c.align"
        :fixed="c.fixed ? c.fixed : false"
        :label="c.label"
        :width="c.width"
        :min-width="c.minWidth || c.width"
        :sortable="c.sortable"
        :index="c.index"
        :class-name="c.className || c.key"
      >
        <template #header="scope">
          <cl-table-header
            :column="c"
            :index="scope.$index"
            @change="onHeaderChange"
          />
        </template>
        <template #default="scope">
          <cl-table-cell
            :column="c"
            :row="scope.row"
            :row-index="scope.$index"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- ./Table Body-->

    <!-- Table Footer-->
    <div v-if="!hideFooter" class="table-footer">
      <cl-table-actions
        :selection="internalSelection"
        :visible-buttons="visibleButtons"
        @delete="onDelete"
        @edit="onEdit"
        @export="onExport"
        @customize-columns="onShowColumnsTransfer"
      >
        <template #prefix>
          <slot name="actions-prefix"></slot>
        </template>
        <template #suffix>
          <slot name="actions-suffix"></slot>
        </template>
      </cl-table-actions>
      <el-pagination
        v-if="
          [
            TABLE_PAGINATION_POSITION_ALL,
            TABLE_PAGINATION_POSITION_BOTTOM,
          ].includes(paginationPosition)
        "
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        class="pagination"
        :layout="paginationLayout"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
    <!-- ./Table Footer-->

    <!-- Table Columns Transfer -->
    <cl-table-columns-transfer
      :columns="columns"
      :selected-column-keys="internalSelectedColumnKeys"
      :visible="columnsTransferVisible"
      @confirm="onColumnsChange"
      @close="onHideColumnsTransfer"
    />
    <!-- ./Table Columns Transfer -->
  </div>
</template>

<style lang="scss" scoped>
.table {
  background-color: var(--cl-container-white-bg);

  .el-table {
    width: 100%;
  }

  .table-header {
    width: 100%;
    text-align: right;
  }

  .table-footer {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    .pagination {
      text-align: right;
    }
  }
}
</style>
<style scoped>
.el-table:deep(th > .cell) {
  line-height: 1.5;
  word-break: normal;
}

.table.embedded:deep(.el-table--border .el-table__inner-wrapper:after) {
  height: 0;
}

.table.embedded:deep(.el-table__border-left-patch),
.table.embedded:deep(.el-table--border:before) {
  width: 0;
}

.table.embedded:deep(
    .el-table--border .el-table__inner-wrapper tr:first-child td:first-child
  ),
.table.embedded:deep(
    .el-table.is-scrolling-left.el-table--border tr:first-child td:first-child
  ),
.table.embedded:deep(
    .el-table--border .el-table__inner-wrapper tr:first-child th:first-child
  ) {
  border-left: none;
}
</style>
