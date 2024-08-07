<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getStore } from '@/store';
import { EMPTY_OBJECT_ID, translate } from '@/utils';
import useRequest from '@/services/request';
import useDatabase from '@/components/core/database/useDatabase';
import useSpider from '@/components/core/spider/useSpider';

const { get, post } = useRequest();

// i18n
const t = translate;
const store = getStore();

const { id } = useSpider(store);

const { allListSelectOptions: allDataSourceSelectOptions } = useDatabase(store);

const allDataSourceSelectOptionsWithDefault = computed<SelectOption[]>(() => {
  return [
    { label: t('common.mode.default'), value: undefined },
    ...allDataSourceSelectOptions.value,
  ];
});

const dsId = ref<string>();
const onDataSourceChange = async (value: string) => {
  await post(`/spiders/${id.value}/database/${value || EMPTY_OBJECT_ID}`);
  await store.dispatch('spider/getById', id.value);
  ElMessage.success(t('components.database.message.success.change'));
};
onBeforeMount(async () => {
  await store.dispatch('database/getAllList');
  const res = await get<Database>(`/spiders/${id.value}/database`);
  dsId.value = res.data?._id;
});
defineOptions({ name: 'ClSpiderDetailActionsDatabase' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'database']"
      :label="t('components.database.label.text')"
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
