<script setup lang="ts">
import { inject, ref, computed } from 'vue';
import { CellCls, CellStyle, ColumnStyle, ElTable } from 'element-plus';
import useColumn from '@/components/ui/table/column';
import useHeader from '@/components/ui/table/header';
import useAction from '@/components/ui/table/action';
import usePagination from '@/components/ui/table/pagination';
import {
  TABLE_PAGINATION_POSITION_ALL,
  TABLE_PAGINATION_POSITION_BOTTOM,
  TABLE_PAGINATION_POSITION_TOP,
} from '@/constants/table';
import { emptyArrayFunc } from '@/utils';
import { ColumnCls } from 'element-plus/es/components/table/src/table/defaults';

const props = withDefaults(
  defineProps<{
    data: TableData;
    columns: TableColumn[];
    selectedColumnKeys?: string[];
    total?: number;
    page?: number;
    pageSize?: number;
    rowKey?: string | ((row: any) => string);
    selectable?: boolean;
    visibleButtons?: BuiltInTableActionButtonName[];
    hideFooter?: boolean;
    selectableFunction?: TableSelectableFunction;
    paginationLayout?: string;
    loading?: boolean;
    paginationPosition?: TablePaginationPosition;
    height?: string | number;
    maxHeight?: string | number;
    embedded?: boolean;
    border?: boolean;
    fit?: boolean;
    emptyText?: string;
    rowClassName?: ColumnCls<any>;
    rowStyle?: ColumnStyle<any>;
    cellClassName?: CellCls<any>;
    cellStyle?: CellStyle<any>;
    headerRowClassName?: ColumnCls<any>;
    headerRowStyle?: ColumnStyle<any>;
    headerCellClassName?: CellCls<any>;
    headerCellStyle?: CellStyle<any>;
    hideDefaultActions?: boolean;
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
defineOptions({ name: 'ClTable' });
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
      ref="tableRef"
      :data="tableData"
      :fit="fit"
      :row-key="rowKey"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :empty-text="emptyText"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="headerCellStyle"
      @selection-change="onSelectionChange"
    >
      <template #empty>
        <slot name="empty" />
      </template>
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
        :class-name="
          (c.className || c.key) + (c.noPadding ? ' no-padding' : '')
        "
      >
        <template #header="scope">
          <component v-if="c.header" :is="c.header" />
          <cl-table-header
            v-else
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
        :hide="hideDefaultActions"
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
  display: flex;
  flex-direction: column;

  .el-table {
    flex: 1;
    width: 100%;

    &:deep(.el-table__cell) {
      overflow: hidden;
    }
  }

  .table-header {
    width: 100%;
    text-align: right;
  }

  .table-footer {
    flex: 0 0 50px;
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

.el-table:deep(td > .cell) {
  overflow: inherit;
}

.el-table:deep(td.no-padding),
.el-table:deep(td.no-padding > .cell) {
  padding: 0;
}

.table.embedded {
  &::before,
  .el-table__inner-wrapper:after,
  .el-table__border-left-patch {
    background-color: transparent !important;
  }

  &:deep(.el-table--border .el-table__inner-wrapper:after) {
    height: 0;
  }

  &:deep(.el-table__border-left-patch),
  &:deep(.el-table--border:before) {
    width: 0;
  }

  &:deep(
      .el-table--border .el-table__inner-wrapper tr:first-child td:first-child
    ),
  &:deep(
      .el-table.is-scrolling-left.el-table--border tr:first-child td:first-child
    ),
  &:deep(
      .el-table--border .el-table__inner-wrapper tr:first-child th:first-child
    ) {
    border-left: none;
  }
}
</style>
