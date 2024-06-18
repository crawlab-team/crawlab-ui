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

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getStore } from '@/store';
import useDataSource from '@/components/ds/useDataSource';
import { ElMessage } from 'element-plus';
import { useRequest, useSpider } from '@/index';

const { get, post } = useRequest();

export default defineComponent({
  name: 'SpiderDetailActionsDataSource',
  setup() {
    // i18n
    const { t } = useI18n();

    // store
    const store = getStore<RootStoreState>();

    const { id } = useSpider(store);

    const { allListSelectOptions: allDataSourceSelectOptions } =
      useDataSource(store);

    const allDataSourceSelectOptionsWithDefault = computed<SelectOption[]>(
      () => {
        return [
          { label: t('common.mode.default'), value: undefined },
          ...allDataSourceSelectOptions.value,
        ];
      }
    );

    const dsId = ref<string>();
    const onDataSourceChange = async (value: string) => {
      await post(
        `/spiders/${id.value}/data-source/${value || '000000000000000000000000'}`
      );
      await store.dispatch('spider/getById', id.value);
      await ElMessage.success(t('components.ds.message.success.change'));
    };
    onBeforeMount(async () => {
      await store.dispatch('ds/getAllList');
      const res = await get<DataSource>(`/spiders/${id.value}/data-source`);
      dsId.value = res.data?._id;
    });

    return {
      allDataSourceSelectOptionsWithDefault,
      onDataSourceChange,
      dsId,
      t,
    };
  },
});
</script>

<style lang="scss" scoped></style>
