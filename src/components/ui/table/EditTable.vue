<script setup lang="ts">
import { ColumnCls } from 'element-plus/es/components/table/src/table/defaults';
import { CellCls, CellStyle, ColumnStyle } from 'element-plus';

withDefaults(
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
  }>(),
  {
    border: true,
  }
);

defineOptions({ name: 'ClEditTable' });
</script>

<template>
  <cl-table
    :data="data"
    :columns="columns"
    :selected-column-keys="selectedColumnKeys"
    :total="total"
    :page="page"
    :page-size="pageSize"
    :row-key="rowKey"
    :selectable="selectable"
    :visible-buttons="visibleButtons"
    :hide-footer="hideFooter"
    :selectable-function="selectableFunction"
    :pagination-layout="paginationLayout"
    :loading="loading"
    :pagination-position="paginationPosition"
    :height="height"
    :max-height="maxHeight"
    :embedded="embedded"
    :border="border"
    :fit="fit"
    :empty-text="emptyText"
    :row-class-name="rowClassName"
    :row-style="rowStyle"
    :cell-class-name="cellClassName"
    :cell-style="cellStyle"
    :header-row-class-name="headerRowClassName"
    :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle"
    :header-cell-class-name="headerCellClassName"
  />
</template>

<style scoped>
.table {
  &:deep(.actions) {
    display: flex;
    align-items: center;
  }

  &:deep(.actions > div) {
    display: flex;
    align-items: center;
  }

  &:deep(.actions .icon) {
    padding: 5px;
    cursor: pointer;
    color: var(--el-table-text-color);
    width: 14px;
    height: 14px;
  }

  &:deep(.actions .icon:hover) {
    border-radius: 50%;
    color: var(--cl-primary-color);
    background-color: var(--cl-primary-plain-color);
  }

  &:deep(.el-table__row:hover),
  &:deep(.el-table__row:hover .el-table__cell) {
    background-color: inherit;
  }

  &:deep(.el-table__cell:hover .cell-actions) {
    display: flex;
  }

  &:deep(.el-table__cell .cell > div > .el-switch),
  &:deep(.el-table__cell .cell > div > .el-checkbox) {
    height: inherit;
  }

  &:deep(.el-table__cell.updated) {
    border-left: 4px solid var(--cl-primary-color);
  }

  &:deep(.el-table__cell.updated:not(.no-padding) .cell) {
    padding-left: 8px;
  }

  &:deep(.el-table__cell.updated .cell .display-value) {
    margin-left: 8px;
  }
}
</style>
