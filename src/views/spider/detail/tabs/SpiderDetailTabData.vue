<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useSpider from '@/components/core/spider/useSpider';
import { EMPTY_OBJECT_ID, isPro, translate } from '@/utils';
import useRequest from '@/services/request';
import { ClDatabaseTableDetailData } from '@/components';
import { TAB_NAME_DATA } from '@/constants';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash';

const t = translate;

const { post } = useRequest();

const dataRef = ref<typeof ClDatabaseTableDetailData | null>(null);

// store
const store = useStore();
const { spider: state } = store.state;

const displayAllFields = computed<boolean>(() => state.dataDisplayAllFields);

const { form } = useSpider(store);

const activeTable = ref<DatabaseTable>();

const getActiveTable = debounce(async () => {
  if (!isPro()) return;
  const { data_source_id, col_name } = form.value;
  if (!data_source_id || !col_name) return;
  const res = await post<any, Promise<ResponseWithData>>(
    `/databases/${data_source_id}/tables/metadata/get`,
    {
      table: col_name,
      filter: dataFilter.value,
    }
  );
  activeTable.value = res.data;
});

onBeforeMount(getActiveTable);
watch(form, getActiveTable);

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
    _sid: form.value._id,
  };
});

defineOptions({ name: 'ClSpiderDetailTabData' });
</script>

<template>
  <div class="spider-detail-tab-data">
    <template v-if="!isPro()">
      <cl-result-list
        :id="form?.col_id"
        :database-id="form?.data_source_id || EMPTY_OBJECT_ID"
        :display-all-fields="displayAllFields"
        no-actions
        embedded
      />
    </template>
    <template v-else>
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
          :active-id="form?.data_source_id || EMPTY_OBJECT_ID"
          :filter="dataFilter"
        />
      </template>
    </template>
  </div>
</template>
