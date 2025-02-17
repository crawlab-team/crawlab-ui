<script setup lang="ts">
import { computed, h, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { TABLE_ACTION_CUSTOMIZE_COLUMNS } from '@/constants';
import { getDataFieldIconByType } from '@/utils/dataFields';
import { ClResultCell } from '@/components';
import { defaultFields } from '@/utils';

interface FilterConditionData {
  key?: string;
  op?: string;
  value?: any;
}

const props = withDefaults(
  defineProps<{
    spiderId?: string;
    noActions?: boolean;
    embedded?: boolean;
    visibleButtons?: BuiltInTableActionButtonName[];
    filter?: FilterConditionData[] | (() => FilterConditionData[]);
    displayAllFields?: boolean;
  }>(),
  {
    visibleButtons: () => [TABLE_ACTION_CUSTOMIZE_COLUMNS],
  }
);

// store
const ns = 'dataCollection';
const store = useStore();
const { dataCollection: state } = store.state as RootStoreState;

// data
const tableData = computed<TableData<Result>>(() => state.resultTableData);

// total
const tableTotal = computed<number>(() => state.resultTableTotal);

// pagination
const tablePagination = computed<TablePagination>(
  () => state.resultTablePagination
);

// data fields
const dataFields = computed<DataField[]>(() => state.form?.fields || []);

// data fields map
const dataFieldsMap = computed<Map<string, DataFieldType>>(() => {
  const map = new Map<string, DataFieldType>();
  dataFields.value.forEach((field: DataField) => {
    map.set(field.key as string, field.type);
  });
  return map;
});

const getTableColumnIcon = (field: DataField): Icon => {
  const type = dataFieldsMap.value.get(field.key as string);
  return getDataFieldIconByType(type);
};

// columns
const tableColumns = computed<TableColumns<Result>>(() => {
  const fields = store.getters[`${ns}/resultFields`] as DataField[];
  return fields
    .filter(f =>
      props.displayAllFields ? true : !defaultFields.includes(f.key as string)
    )
    .map(f => {
      const { key } = f;
      return {
        key,
        label: key,
        minWidth: '240',
        icon: getTableColumnIcon(f),
        value: (row: Result) => {
          const value = row[key as string];
          const type = dataFieldsMap.value.get(key as string);
          return h(ClResultCell, {
            fieldKey: key,
            type,
            value,
          });
        },
      };
    }) as TableColumns<Result>;
});

// filter conditions
const filterConditions = computed<FilterConditionData[]>(() => {
  if (typeof props.filter === 'function') {
    return props.filter() as FilterConditionData[];
  }
  return props.filter || ([] as FilterConditionData[]);
});

// action functions
const actionFunctions = {
  setPagination: pagination =>
    store.commit(`${ns}/setResultTablePagination`, pagination),
  getList: async () => {
    const { spiderId } = props;
    if (!spiderId) return;
    return store.dispatch(`${ns}/getResultData`, {
      id: spiderId,
      params: {
        conditions: filterConditions.value,
        ...tablePagination.value,
      },
    });
  },
  getAll: async () => {
    console.warn('getAll is not implemented');
  },
  deleteList: (ids: string[]) => {
    console.warn('deleteList is not implemented');
  },
  deleteByIdConfirm: (row: BaseModel) => {
    console.warn('deleteByIdConfirm is not implemented');
  },
} as ListLayoutActionFunctions;

const { getList } = actionFunctions;
onBeforeMount(getList);
watch(() => props.spiderId, getList);
watch(() => tablePagination.value, getList);

onBeforeUnmount(() => {
  store.commit(`${ns}/resetResultTableData`);
  store.commit(`${ns}/resetResultTablePagination`);
  store.commit(`${ns}/resetResultTableFilter`);
});
defineOptions({ name: 'ClResultList' });
</script>

<template>
  <cl-list-layout
    :action-functions="actionFunctions"
    :no-actions="noActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :visible-buttons="visibleButtons"
    :embedded="embedded"
    class="result-list"
  />

  <cl-result-cell-dialog />
</template>

<style scoped>
.result-list {
  .nav-actions {
    border-bottom: none;
  }
}
</style>
