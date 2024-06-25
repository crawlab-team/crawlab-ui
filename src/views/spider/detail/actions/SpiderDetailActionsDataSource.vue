<script setup lang="ts">
defineOptions({ name: 'ClSpiderDetailActionsDataSource' });
import { computed, onBeforeMount, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getStore } from '@/store';
import { translate } from '@/utils';
import useRequest from '@/services/request';
import useDataSource from '@/components/ds/useDataSource';
import useSpider from '@/components/spider/useSpider';

const { get, post } = useRequest();

// i18n
const t = translate;
const store = getStore();

const { id } = useSpider(store);

const { allListSelectOptions: allDataSourceSelectOptions } =
  useDataSource(store);

const allDataSourceSelectOptionsWithDefault = computed<SelectOption[]>(() => {
  return [
    { label: t('common.mode.default'), value: undefined },
    ...allDataSourceSelectOptions.value,
  ];
});

const dsId = ref<string>();
const onDataSourceChange = async (value: string) => {
  await post(
    `/spiders/${id.value}/data-source/${value || '000000000000000000000000'}`
  );
  await store.dispatch('spider/getById', id.value);
  ElMessage.success(t('components.ds.message.success.change'));
};
onBeforeMount(async () => {
  await store.dispatch('ds/getAllList');
  const res = await get<DataSource>(`/spiders/${id.value}/data-source`);
  dsId.value = res.data?._id;
});
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'database']"
      :label="t('components.ds.label.text')"
    />
    <cl-nav-action-item>
      <el-select v-model="dsId" @change="onDataSourceChange">
        <el-option
          v-for="(op, $index) in allDataSourceSelectOptionsWithDefault"
          :key="$index"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style lang="scss" scoped></style>
