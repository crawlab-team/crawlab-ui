<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { EMPTY_OBJECT_ID, translate } from '@/utils';
import { useDatabase } from '@/components';
import useRequest from '@/services/request';
import { useSpiderDetail } from '@/views';

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

const tableNames = ref<string[]>([]);
const getTableNames = async () => {
  if (!form.value?.data_source_id) return;
  const res = await get<any, Promise<ResponseWithData<DatabaseMetadata>>>(
    `/databases/${form.value.data_source_id}/metadata`
  );
  tableNames.value =
    res?.data?.databases?.[0]?.tables?.map(table => table.name as string) || [];
};
const tableSelectOptions = computed<SelectOption[]>(() =>
  tableNames.value.map(name => ({ label: name, value: name }))
);
onBeforeMount(getTableNames);
watch(() => form.value?.data_source_id, getTableNames);

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

onBeforeMount(() => {});

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
      <el-select
        class="table"
        v-model="form.col_name"
        filterable
        :placeholder="t('components.spider.actions.data.placeholder.table')"
      >
        <template #label="{ label }">
          <div>
            <cl-icon :icon="['fa', 'table']" />
            <span style="margin-left: 5px">{{ label }}</span>
          </div>
        </template>
        <el-option
          v-for="(op, $index) in tableSelectOptions"
          :key="$index"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
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

  &:deep(.el-select) {
    width: 150px;
    margin-right: 10px;

    &.database {
      width: 160px;
    }
  }
}
</style>
