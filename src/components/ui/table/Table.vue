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

defineSlots<{
  empty?: void;
  'actions-prefix'?: void;
  'actions-suffix'?: void;
}>();

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    data: TableData;
    columns: TableColumn[];
    selectedColumnKeys?: string[];
    total?: number;
    page?: number;
    pageSize?: number;
    pageSizes?: number[];
    paginationLayout?: string;
    paginationPosition?: TablePaginationPosition;
    rowKey?: string | ((row: any) => string);
    selectable?: boolean;
    visibleButtons?: BuiltInTableActionButtonName[];
    hideFooter?: boolean;
    selectableFunction?: TableSelectableFunction;
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
    stickyHeader?: boolean;
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
    stickyHeader: true,
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

const className = computed(() => {
  const { embedded, stickyHeader } = props;
  const cls = [];
  if (embedded) {
    cls.push('embedded');
  }
  if (stickyHeader) {
    cls.push('sticky-header');
  }
  return cls.join(' ');
});

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
    class="table"
    :class="className"
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
        class="pagination"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
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
        :selectable="selectableFunction"
        width="40"
        fixed="left"
      />
      <el-table-column
        v-for="c in selectedColumns"
        :prop="c.key"
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
            :key="scope.row[c.key]"
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
        class="pagination"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
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

<style scoped>
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

  &.sticky-header {
    height: 100%;

    .el-table {
      height: 100%;

      &:deep(.el-table__inner-wrapper) {
        height: 100%;
        overflow: auto;
      }

      &:deep(.el-table__header-wrapper) {
        position: sticky;
        top: 0;
        z-index: 1;
      }
    }
  }
}

.el-table {
  &:deep(th > .cell) {
    line-height: 1.5;
    word-break: normal;
  }

  &:deep(td > .cell) {
    overflow: inherit;
    text-overflow: inherit;
  }

  &:deep(td.no-padding),
  &:deep(td.no-padding > .cell) {
    padding: 0;
  }
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
