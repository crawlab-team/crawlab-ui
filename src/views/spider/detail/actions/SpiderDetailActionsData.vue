<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { EMPTY_OBJECT_ID, translate } from '@/utils';
import { useDatabase } from '@/components';
import useRequest from '@/services/request';
import { useSpiderDetail } from '@/views';
import { debounce } from 'lodash';

const t = translate;

const { get } = useRequest();

// store
const ns = 'spider';
const store = useStore();
const { spider: state } = store.state as RootStoreState;

// display all fields
const displayAllFields = ref<boolean>(state.dataDisplayAllFields);
const onDisplayAllFieldsChange = (val: boolean) => {
  store.commit(`${ns}/setDataDisplayAllFields`, val);
};

const form = computed(() => state.form);

const { activeId } = useSpiderDetail();

const {
  allListSelectOptions: allDatabaseSelectOptions,
  allDict: allDatabaseDict,
} = useDatabase(store);
onBeforeMount(() => {
  store.dispatch(`database/getAllList`);
});

const databaseMetadata = computed(() => state.databaseMetadata);
const isMultiDatabases = computed<boolean>(() => {
  if (!databaseMetadata.value?.databases?.length) return false;
  return databaseMetadata.value.databases.length > 1;
});
watch(isMultiDatabases, () => {
  if (isMultiDatabases.value) {
    updateMultiDbTableName();
  } else {
    updateTableName();
  }
});

const dataSourceId = ref<string>(form.value?.data_source_id || EMPTY_OBJECT_ID);
const onDatabaseChange = async (value: string) => {
  dataSourceId.value = form.value?.data_source_id || EMPTY_OBJECT_ID;
  await ElMessageBox.confirm(
    t('components.spider.messageBox.confirm.changeDatabase.message'),
    t('components.spider.messageBox.confirm.changeDatabase.title'),
    {
      type: 'warning',
    }
  );
  store.commit(`${ns}/setForm`, {
    ...form.value,
    data_source_id: value,
  });
  try {
    await store.dispatch(`${ns}/updateById`, {
      id: activeId.value,
      form: form.value,
    });
    ElMessage.success(t('common.message.success.save'));
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
watch(
  () => form.value?.data_source_id,
  value => {
    dataSourceId.value = value || EMPTY_OBJECT_ID;
  }
);
const getDataSourceByDatabaseId = (id: string): DatabaseDataSource => {
  const db = allDatabaseDict.value.get(id) as Database | undefined;
  if (!db?.data_source) return 'mongo';
  return db.data_source;
};

// database table options
const databaseTableSelectOptions = computed<SelectOption[]>(() => {
  return store.getters[`${ns}/databaseTableSelectOptions`];
});

// single database table name
const tableName = ref<string>('');
const updateTableName = () => {
  if (isMultiDatabases.value) return;
  tableName.value = form.value?.col_name || '';
};
watch(() => form.value?.col_name, updateTableName);
const onTableChange = debounce(async (value: string | string[]) => {
  store.commit(`${ns}/setForm`, {
    ...form.value,
    db_name: '',
    col_name: value,
  });
  await updateForm();
});

// multi database table name
const multiDbTableName = ref<string[]>([]);
const updateMultiDbTableName = () => {
  if (!isMultiDatabases.value) return;
  multiDbTableName.value = [
    form.value.db_name || '',
    form.value.col_name || '',
  ];
};
watch(
  () => JSON.stringify([form.value?.db_name, form.value?.col_name]),
  updateMultiDbTableName
);
const onMultiDbTableChange = debounce(async (value: string[]) => {
  const dbName = value[0];
  const colName = value[1];
  store.commit(`${ns}/setForm`, {
    ...form.value,
    db_name: dbName,
    col_name: colName,
  });
  await updateForm();
});

// update form (save spider)
const updateForm = async () => {
  try {
    await store.dispatch(`${ns}/updateById`, {
      id: activeId.value,
      form: form.value,
    });
    ElMessage.success(t('common.message.success.save'));
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

defineOptions({ name: 'ClSpiderDetailActionsData' });
</script>

<template>
  <cl-nav-action-group v-if="form" class="spider-detail-actions-data">
    <cl-nav-action-fa-icon :icon="['fa', 'table']" />
    <cl-nav-action-item>
      <el-select
        class="database"
        v-model="dataSourceId"
        @change="onDatabaseChange"
      >
        <template #label="{ label }">
          <div>
            <cl-database-data-source
              :data-source="
                getDataSourceByDatabaseId(form.data_source_id as string)
              "
              icon-only
            />
            <span style="margin: 5px">{{ label }}</span>
            <cl-icon
              v-if="form.data_source_id === EMPTY_OBJECT_ID"
              color="var(--cl-warning-color)"
              :icon="['fa', 'star']"
            />
          </div>
        </template>
        <el-option
          v-for="(op, $index) in allDatabaseSelectOptions"
          :key="$index"
          :label="op.label"
          :value="op.value"
        >
          <div>
            <cl-database-data-source
              :data-source="getDataSourceByDatabaseId(op.value)"
              icon-only
            />
            <span style="margin: 5px">{{ op.label }}</span>
            <cl-icon
              v-if="op.value === EMPTY_OBJECT_ID"
              color="var(--cl-warning-color)"
              :icon="['fa', 'star']"
            />
          </div>
        </el-option>
      </el-select>
    </cl-nav-action-item>
    <cl-nav-action-item>
      <template v-if="isMultiDatabases">
        <el-cascader
          class="table"
          v-model="multiDbTableName"
          :options="databaseTableSelectOptions"
          filterable
          :placeholder="t('components.spider.actions.data.placeholder.table')"
          @change="onMultiDbTableChange"
        >
          <template #label="{ label }">
            <div>
              <cl-icon :icon="['fa', 'table']" />
              <span style="margin-left: 5px">{{ label }}</span>
            </div>
          </template>
        </el-cascader>
      </template>
      <template v-else>
        <el-select
          class="table"
          v-model="tableName"
          filterable
          :placeholder="t('components.spider.actions.data.placeholder.table')"
          @change="onTableChange"
        >
          <template #label="{ label }">
            <div>
              <cl-icon :icon="['fa', 'table']" />
              <span style="margin-left: 5px">{{ label }}</span>
            </div>
          </template>
          <el-option
            v-for="(op, $index) in databaseTableSelectOptions"
            :key="$index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </template>
    </cl-nav-action-item>
    <cl-nav-action-item>
      <el-tooltip
        :content="t('components.spider.actions.data.tooltip.displayAllFields')"
      >
        <div class="display-all-fields">
          <cl-switch
            v-model="displayAllFields"
            :active-icon="['fa', 'eye']"
            :inactive-icon="['fa', 'eye']"
            inline-prompt
            @change="onDisplayAllFieldsChange"
          />
        </div>
      </el-tooltip>
    </cl-nav-action-item>
    <cl-nav-action-item v-export="form.col_name">
      <cl-fa-icon-button
        :icon="['fa', 'download']"
        :tooltip="t('components.spider.actions.data.tooltip.export')"
        type="primary"
        id="export-btn"
        class-name="export-btn"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped>
.spider-detail-actions-data {
  &:deep(.display-all-fields) {
    margin-right: 10px;
  }

  &:deep(.el-cascader),
  &:deep(.el-select) {
    width: 150px;
    margin-right: 10px;

    &.database {
      width: 160px;
    }
  }

  &:deep(.el-cascader) {
    width: 200px;
  }
}
</style>
