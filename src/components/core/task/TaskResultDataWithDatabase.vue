<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash';
import { TAB_NAME_DATA } from '@/constants';
import { EMPTY_OBJECT_ID, translate } from '@/utils';
import useRequest from '@/services/request';
import { ClDatabaseTableDetailData, useTask } from '@/components';
import { useSpider } from '@/components';

defineProps<{
  displayAllFields?: boolean;
}>();

const t = translate;

const { post } = useRequest();

const dataRef = ref<typeof ClDatabaseTableDetailData | null>(null);

// store
const store = useStore();

const { form } = useTask(store);

const { allDict: allSpiderDict } = useSpider(store);

const spider = computed<Spider | undefined>(
  () =>
    allSpiderDict.value.get(form.value?.spider_id || EMPTY_OBJECT_ID) as Spider
);

const activeTable = ref<DatabaseTable>();
const getActiveTable = debounce(async () => {
  if (!spider.value) return;
  const { data_source_id, db_name, col_name } = spider.value;
  if (!data_source_id || !col_name) return;
  const res = await post<any, Promise<ResponseWithData>>(
    `/databases/${data_source_id}/tables/metadata/get`,
    {
      database: db_name,
      table: col_name,
      filter: dataFilter.value,
    }
  );
  activeTable.value = res.data;
});

watch(() => spider.value?.col_name, getActiveTable);
onBeforeMount(getActiveTable);

const activeTabName = ref<string>(TAB_NAME_DATA);
const tabsItems = computed<NavItem[]>(() => [
  {
    id: TAB_NAME_DATA,
    title: t('common.tabs.data'),
  },
]);

const hasChanges = computed<boolean>(() => dataRef.value?.hasChanges);

const commitLoading = ref(false);
const onCommit = async () => {
  commitLoading.value = true;
  try {
    switch (activeTabName.value) {
      case TAB_NAME_DATA:
        await dataRef.value?.commit?.();
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

const onRollback = () => {
  dataRef.value?.rollback?.();
};

const dataFilter = computed<{ [key: string]: any } | undefined>(() => {
  if (!form.value?._id) return;
  return {
    _tid: form.value._id,
  };
});

defineOptions({ name: 'ClTaskResultDataWithDatabase' });
</script>

<template>
  <div class="task-result-data-with-database">
    <cl-database-nav-tabs
      v-model="activeTabName"
      :tabs-items="tabsItems"
      :can-save="hasChanges"
      :commit-loading="commitLoading"
      @commit="onCommit"
      @rollback="onRollback"
    />
    <template v-if="activeTabName === TAB_NAME_DATA">
      <cl-database-table-detail-data
        v-if="activeTable"
        ref="dataRef"
        :active-table="activeTable"
        :active-id="spider?.data_source_id || EMPTY_OBJECT_ID"
        :database-name="spider?.db_name"
        :filter="dataFilter"
        :display-all-fields="displayAllFields"
      />
    </template>
  </div>
</template>
