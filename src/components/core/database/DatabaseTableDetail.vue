<script setup lang="tsx">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { TAB_NAME_COLUMNS, TAB_NAME_DATA, TAB_NAME_INDEXES } from '@/constants';
import { plainClone, translate } from '@/utils';
import useRequest from '@/services/request';
import {
  getColumnStatus,
  getIndexStatus,
  isValidTable,
} from '@/utils/database';
import { ClDatabaseTableDetailData } from '@/components';

const props = defineProps<{
  activeId?: string;
  databaseName?: string;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const { get, post } = useRequest();

const t = translate;

const dataRef = ref<typeof ClDatabaseTableDetailData | null>(null);

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const defaultTabName = computed(() => state.defaultTabName);

const table = computed<DatabaseTable | undefined>(
  () => state.activeNavItem?.data
);
const isNew = computed(() => state.activeNavItem?.new);
const activeTable = ref<DatabaseTable | undefined>(plainClone(table.value));
const internalTable = ref<DatabaseTable | undefined>(plainClone(table.value));
watch(
  () => table.value?.name,
  () => {
    if (internalTable.value) {
      internalTable.value.name = table.value?.name;
    }
  }
);

const getTable = async () => {
  if (isNew.value) {
    activeTable.value = plainClone(table.value);
  } else {
    const res = await get(
      `/databases/${props.activeId}/tables/metadata?database=${props.databaseName}&table=${table.value?.name}`
    );
    activeTable.value = { ...res.data, timestamp: Date.now() };
  }
};
onBeforeMount(getTable);
watch(table, getTable);

const resetTable = () => {
  internalTable.value = plainClone(activeTable.value);
};

const onRollback = () => {
  resetTable();
  dataRef.value?.rollback?.();
};
watch(activeTable, onRollback);

const commitLoading = ref(false);
const onCommit = async () => {
  commitLoading.value = true;
  try {
    switch (activeTabName.value) {
      case TAB_NAME_DATA:
        await dataRef.value?.commit?.();
        break;
      case TAB_NAME_COLUMNS:
      case TAB_NAME_INDEXES:
        if (isNew.value) {
          await createTable();
        } else {
          await modifyTable();
        }
        break;
    }
    ElMessage.success(t('common.message.success.action'));
  } catch (error: any) {
    ElMessage.error(error.message);
    throw error;
  } finally {
    commitLoading.value = false;
  }
};

const createTable = async () => {
  await post(`/databases/${props.activeId}/tables/create`, {
    database_name: props.databaseName,
    table: internalTable.value,
  });
  await getTable();
  store.commit(`${ns}/setActiveNavItem`, {
    ...state.activeNavItem,
    id: `${props.databaseName}:${internalTable.value?.name}`,
    new: false,
  });
  emit('refresh');
};

const modifyTable = async () => {
  await post(`/databases/${props.activeId}/tables/modify`, {
    database_name: props.databaseName,
    table: {
      ...internalTable.value,
      columns: internalTable.value?.columns?.map(c => {
        return {
          ...c,
          status: getColumnStatus(c, activeTable.value),
        };
      }),
      indexes: internalTable.value?.indexes?.map(i => {
        return {
          ...i,
          status: getIndexStatus(i, activeTable.value),
        };
      }),
    },
  });
  await getTable();
  emit('refresh');
};

const activeTabName = ref<string>(defaultTabName.value || TAB_NAME_DATA);
const tabsItems = computed<NavItem[]>(() =>
  [
    { id: TAB_NAME_DATA, title: t('common.tabs.data') },
    { id: TAB_NAME_COLUMNS, title: t('common.tabs.columns') },
    { id: TAB_NAME_INDEXES, title: t('common.tabs.indexes') },
  ].filter(item => {
    if (isNew.value) {
      return item.id !== TAB_NAME_DATA;
    }
    return true;
  })
);
watch(defaultTabName, () => {
  activeTabName.value = defaultTabName.value || TAB_NAME_DATA;
});
watch(activeTabName, () => {
  switch (activeTabName.value) {
    case TAB_NAME_DATA:
      resetTable();
      break;
    case TAB_NAME_COLUMNS:
    case TAB_NAME_INDEXES:
      if (!isNew.value) {
        resetTable();
      }
      break;
  }
});

const form = ref<DatabaseTable>(internalTable.value || {});
watch(internalTable, () => {
  form.value = internalTable.value || {};
});

const hasDataChange = computed<boolean>(() => {
  if (!dataRef.value) return false;
  return dataRef.value.hasChanges;
});
const hasColumnsChange = computed<boolean>(() => {
  if (!internalTable.value) return false;
  return (
    internalTable.value.columns?.some(c =>
      getColumnStatus(c, activeTable.value)
    ) || false
  );
});
const hasIndexesChange = computed<boolean>(() => {
  if (!internalTable.value) return false;
  return (
    internalTable.value.indexes?.some(i =>
      getIndexStatus(i, activeTable.value)
    ) || false
  );
});
const hasChanges = computed(() => {
  return (
    hasDataChange.value || hasColumnsChange.value || hasIndexesChange.value
  );
});
const tableValid = computed(() => isValidTable(internalTable.value));

const canSave = computed(() => {
  return tableValid.value && hasChanges.value;
});

defineOptions({ name: 'ClDatabaseTableDetail' });
</script>

<template>
  <div class="database-table-detail">
    <!-- Nav Tabs -->
    <cl-database-nav-tabs
      v-model="activeTabName"
      :tabs-items="tabsItems"
      :can-save="canSave"
      :has-changes="hasChanges"
      :commit-loading="commitLoading"
      @commit="onCommit"
      @rollback="onRollback"
    />

    <!-- Tab Content -->
    <div class="tab-content">
      <template v-if="activeTabName === TAB_NAME_DATA">
        <cl-database-table-detail-data
          ref="dataRef"
          :loading="commitLoading"
          :active-table="activeTable"
          :active-id="activeId"
          :database-name="databaseName"
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_COLUMNS">
        <cl-database-table-detail-columns
          v-model="internalTable"
          :active-table="activeTable"
          :loading="commitLoading"
          @change="
            (val: DatabaseTable) => {
              internalTable = val;
            }
          "
        />
      </template>
      <template v-else-if="activeTabName === TAB_NAME_INDEXES">
        <cl-database-table-detail-indexes
          v-model="internalTable"
          :active-table="activeTable"
          :loading="commitLoading"
          @change="
            (val: DatabaseTable) => {
              internalTable = val;
            }
          "
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.database-table-detail {
  height: 100%;
  display: flex;
  flex-direction: column;

  .nav-tabs {
    flex: 0 0 40px;

    &:deep(.nav-tabs-actions) {
      display: flex;
    }
  }

  .tab-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
