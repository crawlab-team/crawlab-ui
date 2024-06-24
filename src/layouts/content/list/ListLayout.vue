<script setup lang="ts">
defineOptions({ name: 'ClListLayout' });
import { computed, onMounted, provide, ref, watch } from 'vue';
import { emptyArrayFunc, emptyObjectFunc } from '@/utils/func';
import { getMd5 } from '@/utils/hash';
import {
  ACTION_ADD,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
} from '@/constants/action';
import { FilterConditionData } from '@/components/filter/FilterCondition.vue';

const props = withDefaults(
  defineProps<{
    navActions: ListActionGroup[];
    rowKey: string | ((row: any) => string);
    tableColumns: TableColumns;
    tableData: TableData;
    tableTotal: number;
    tablePagination: TablePagination;
    tableListFilter: FilterConditionData[];
    tableListSort: SortData[];
    tableActionsPrefix: ListActionButton[];
    tableActionsSuffix: ListActionButton[];
    tableFilter: any;
    actionFunctions?: ListLayoutActionFunctions;
    noActions: boolean;
    selectableFunction: TableSelectableFunction;
    visibleButtons: BuiltInTableActionButtonName[];
    tablePaginationLayout?: string;
    tableLoading?: boolean;
    tablePaginationPosition?: TablePaginationPosition;
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
    selectableFunction: () => true,
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
  return getMd5(JSON.stringify(tableColumns));
});
</script>

<template>
  <div class="list-layout">
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
                :placeholder="(item as ListActionFilter).placeholder"
                @change="
                  (value: any) => (item as ListActionFilter).onChange?.(value)
                "
              />
            </template>
            <template v-else-if="item.action === ACTION_FILTER_SELECT">
              <cl-filter-select
                :label="(item as ListActionFilter).label"
                :placeholder="(item as ListActionFilter).placeholder"
                :options="(item as ListActionFilter).options"
                :options-remote="(item as ListActionFilter).optionsRemote"
                @change="
                  (value: any) => (item as ListActionFilter).onChange?.(value)
                "
              />
            </template>
            <template v-else>
              <cl-nav-action-button
                v-auth="ACTION_ADD"
                :id="(item as ListActionButton).id"
                :class-name="(item as ListActionButton).className"
                :button-type="(item as ListActionButton).buttonType"
                :disabled="(item as ListActionButton).disabled"
                :icon="(item as ListActionButton).icon"
                :label="(item as ListActionButton).label"
                :size="(item as ListActionButton).size"
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
        selectable
        :selectable-function="selectableFunction"
        :visible-buttons="visibleButtons"
        :pagination-layout="tablePaginationLayout"
        :loading="tableLoading"
        :embedded="embedded"
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
      </cl-table>
      <!-- ./Table -->
    </div>

    <slot name="extra" />
  </div>
</template>

<style lang="scss" scoped>
.list-layout {
  .nav-actions {
    background-color: var(--cl-container-white-bg);
    border-bottom: none;

    .nav-action-group {
      .nav-action-item {
        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }

  .content {
    background-color: var(--cl-container-white-bg);
  }
}
</style>
<style scoped>
.list-layout:deep(.tag) {
  margin-right: 10px;
}

.list-layout:deep(.actions .button-wrapper) {
  margin-right: 5px;
}
</style>
