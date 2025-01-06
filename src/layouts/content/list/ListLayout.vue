<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { emptyArrayFunc, emptyObjectFunc } from '@/utils/func';
import { getMd5 } from '@/utils/hash';
import { ACTION_FILTER_SEARCH, ACTION_FILTER_SELECT } from '@/constants/action';
import { ColumnCls } from 'element-plus/es/components/table/src/table/defaults';
import { CellCls, CellStyle, ColumnStyle } from 'element-plus';

const slots = defineSlots<{
  tabs?: any;
  'nav-actions-extra'?: any;
  'table-empty'?: any;
  extra?: any;
}>();

const props = withDefaults(
  defineProps<{
    navActions?: ListActionGroup[];
    rowKey?: string | ((row: any) => string);
    tableColumns: TableColumns;
    tableData: TableData;
    tableTotal?: number;
    tablePagination?: TablePagination;
    tablePageSizes?: number[];
    tableListFilter?: FilterConditionData[];
    tableListSort?: SortData[];
    tableActionsPrefix?: ListActionButton[];
    tableActionsSuffix?: ListActionButton[];
    tableFilter?: any;
    tablePaginationLayout?: string;
    tableLoading?: boolean;
    tableRowClassName?: ColumnCls<any>;
    tableRowStyle?: ColumnStyle<any>;
    tableCellClassName?: CellCls<any>;
    tableCellStyle?: CellStyle<any>;
    tableHeaderRowClassName?: ColumnCls<any>;
    tableHeaderRowStyle?: ColumnStyle<any>;
    tableHeaderCellClassName?: CellCls<any>;
    tableHeaderCellStyle?: CellStyle<any>;
    actionFunctions?: ListLayoutActionFunctions;
    noActions?: boolean;
    selectable?: boolean;
    selectableFunction?: TableSelectableFunction;
    visibleButtons?: BuiltInTableActionButtonName[];
    embedded?: boolean;
  }>(),
  {
    navActions: emptyArrayFunc,
    rowKey: '_id',
    tableColumns: emptyArrayFunc,
    tableData: emptyArrayFunc,
    tableTotal: 0,
    tablePagination: () => ({
      page: 1,
      size: 10,
    }),
    tableListFilter: emptyArrayFunc,
    tableListSort: emptyArrayFunc,
    tableActionsPrefix: emptyArrayFunc,
    tableActionsSuffix: emptyArrayFunc,
    tableFilter: emptyObjectFunc,
    noActions: false,
    selectable: true,
    selectableFunction: () => () => true,
    visibleButtons: emptyArrayFunc,
  }
);

const emit = defineEmits<{
  (e: 'select', value: TableData): void;
  (e: 'edit', value: TableData): void;
  (e: 'delete', value: TableData): void;
}>();

const tableRef = ref();

const computedTableRef = computed(() => tableRef.value);

const onSelect = (value: TableData) => {
  emit('select', value);
};

const onEdit = (value: TableData) => {
  emit('edit', value);
};

const onDelete = (value: TableData) => {
  emit('delete', value);
};

const onPaginationChange = (value: TablePagination) => {
  props.actionFunctions?.setPagination(value);
};

if (props.actionFunctions) {
  // get list when table pagination changes
  watch(() => props.tablePagination, props.actionFunctions?.getList);

  // provide as context
  provide<ListLayoutActionFunctions>('action-functions', props.actionFunctions);

  // get list before mount
  onMounted(() => {
    props.actionFunctions?.getList();
  });
}

const getNavActionButtonDisabled = (btn: ListActionButton) => {
  if (typeof btn.disabled === 'boolean') {
    return btn.disabled;
  } else if (typeof btn.disabled === 'function') {
    return btn.disabled(computedTableRef.value);
  } else {
    return false;
  }
};

const tableColumnsHash = computed<string>(() => {
  const { tableColumns } = props;
  return getMd5(tableColumns);
});

const className = computed(() => {
  const cls = [];
  if (props.noActions) {
    cls.push('no-actions');
  }
  if (slots.tabs) {
    cls.push('has-tabs');
  }
  if (props.embedded) {
    cls.push('embedded');
  }
  return cls.join(' ');
});

defineOptions({ name: 'ClListLayout' });
</script>

<template>
  <div class="list-layout" :class="className" :data-test-total="tableTotal">
    <div class="content">
      <!-- Nav Actions -->
      <cl-nav-actions v-if="!noActions" ref="navActions" class="nav-actions">
        <cl-nav-action-group
          v-for="(grp, i) in navActions"
          :key="grp.name || i"
        >
          <cl-nav-action-item
            v-for="(item, j) in grp.children"
            :key="`${grp.name}-${item.id || j}`"
          >
            <template v-if="item.action === ACTION_FILTER_SEARCH">
              <cl-filter-input
                :id="item.id"
                :label="item.label"
                :placeholder="(item as ListActionFilter).placeholder"
                :prefix-icon="(item as ListActionFilter).prefixIcon"
                :default-value="(item as ListActionFilter).defaultValue"
                @change="
                  (value: any) => (item as ListActionFilter).onChange?.(value)
                "
                @clear="() => (item as ListActionFilter).onEnter?.(undefined)"
                @enter="
                  (value: any) => (item as ListActionFilter).onEnter?.(value)
                "
              />
            </template>
            <template v-else-if="item.action === ACTION_FILTER_SELECT">
              <cl-filter-select
                :id="item.id"
                :label="item.label"
                :placeholder="(item as ListActionFilter).placeholder"
                :options="(item as ListActionFilter).options"
                :options-remote="(item as ListActionFilter).optionsRemote"
                :clearable="(item as ListActionFilter).clearable"
                :no-all-option="(item as ListActionFilter).noAllOption"
                :default-value="(item as ListActionFilter).defaultValue"
                @change="
                  (value: any) => (item as ListActionFilter).onChange?.(value)
                "
              />
            </template>
            <template v-else>
              <cl-nav-action-button
                :id="item.id"
                :class-name="item.className"
                :label="item.label"
                :size="item.size"
                :button-type="(item as ListActionButton).buttonType"
                :disabled="(item as ListActionButton).disabled"
                :icon="(item as ListActionButton).icon"
                :tooltip="(item as ListActionButton).tooltip"
                :type="(item as ListActionButton).type"
                @click="(item as ListActionButton).onClick"
              />
            </template>
          </cl-nav-action-item>
        </cl-nav-action-group>
        <slot name="nav-actions-extra"></slot>
      </cl-nav-actions>
      <!-- ./Nav Actions -->

      <div v-if="slots.tabs" class="tabs">
        <slot name="tabs" />
      </div>

      <!-- Table -->
      <cl-table
        ref="tableRef"
        :key="tableColumnsHash"
        :row-key="rowKey"
        :columns="tableColumns"
        :data="tableData"
        :total="tableTotal"
        :page="tablePagination.page"
        :page-size="tablePagination.size"
        :page-sizes="tablePageSizes"
        :selectable="selectable"
        :selectable-function="selectableFunction"
        :visible-buttons="visibleButtons"
        :pagination-layout="tablePaginationLayout"
        :loading="tableLoading"
        :embedded="embedded"
        :header-cell-class-name="tableHeaderCellClassName"
        :header-cell-style="tableHeaderCellStyle"
        :cell-class-name="tableCellClassName"
        :cell-style="tableCellStyle"
        :header-row-class-name="tableHeaderRowClassName"
        :header-row-style="tableHeaderRowStyle"
        :row-class-name="tableRowClassName"
        :row-style="tableRowStyle"
        @selection-change="onSelect"
        @delete="onDelete"
        @edit="onEdit"
        @pagination-change="onPaginationChange"
        @header-change="actionFunctions?.onHeaderChange"
      >
        <template #actions-prefix>
          <cl-nav-action-button
            v-for="(btn, $index) in tableActionsPrefix"
            :key="$index"
            :button-type="btn.buttonType"
            :disabled="getNavActionButtonDisabled(btn)"
            :icon="btn.icon"
            :label="btn.label"
            :size="btn.size"
            :tooltip="btn.tooltip"
            :type="btn.type"
            @click="btn.onClick"
          />
        </template>
        <template #actions-suffix>
          <cl-nav-action-button
            v-for="(btn, $index) in tableActionsSuffix"
            :key="$index"
            :button-type="btn.buttonType"
            :disabled="btn.disabled"
            :icon="btn.icon"
            :label="btn.label"
            :size="btn.size"
            :tooltip="btn.tooltip"
            :type="btn.type"
            @click="btn.onClick"
          />
        </template>
        <template #empty>
          <slot name="table-empty" />
        </template>
      </cl-table>
      <!-- ./Table -->
    </div>

    <slot name="extra" />
  </div>
</template>

<style scoped>
.list-layout {
  height: 100%;

  &:not(.embedded):not(.no-actions) {
    &:not(.has-tabs):deep(.table.sticky-header) {
      height: calc(100% - 52px);
    }

    &.has-tabs:deep(.table.sticky-header) {
      height: calc(100% - 52px - 40px);
    }

    &:deep(.table .table-footer) {
      border-top: 1px solid var(--el-border-color);
    }
  }

  &:deep(.tag) {
    margin-right: 10px;
  }

  .nav-actions {
    max-height: 52px;
    background-color: var(--cl-container-white-bg);
    border-bottom: none;

    .nav-action-group {
      .nav-action-item {
        #filter-search {
          width: 200px;
        }

        &:deep(label.label) {
          margin-right: 5px;
          font-size: 14px;
        }
      }
    }
  }

  .tabs {
    width: 100%;
    height: 40px;
    display: flex;
    align-content: center;
    border-top: 1px solid var(--el-border-color);

    &:deep(.nav-tabs) {
      width: 100%;
      display: flex;
      align-items: center;
    }
  }

  .content {
    height: 100%;
    background-color: var(--cl-container-white-bg);

    &:deep(.actions .button-wrapper) {
      margin-right: 5px;
    }

    &:deep(.actions .el-button-group .button-wrapper) {
      margin-right: inherit;
    }
  }

  &:deep(.form .tag) {
    margin-right: 0;
  }
}
</style>
