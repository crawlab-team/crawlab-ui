<script setup lang="ts">
defineOptions({ name: 'ClDetailTabList' });
import { computed, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { FILTER_OP_EQUAL } from '@/constants/filter';

const props = defineProps<{
  filterKey: string;
  ns: ListStoreNamespace;
}>();

// route
const route = useRoute();

// store
const store = useStore();

// id
const id = computed<string>(() => route.params.id as string);

// set filter
const setTableListFilter = () => {
  const { ns, filterKey } = props;
  store.commit(`${ns}/setTableListFilter`, [
    {
      key: filterKey,
      op: FILTER_OP_EQUAL,
      value: id.value,
    },
  ] as FilterConditionData[]);
};

// get data
const getData = async () => {
  const { ns } = props;
  setTableListFilter();
  await store.dispatch(`${ns}/getList`);
};

onBeforeMount(getData);
watch(() => id.value, getData);

onBeforeUnmount(() => {
  const { ns } = props;
  store.commit(`${ns}/resetTableListFilter`);
  store.commit(`${ns}/resetTableData`);
});
</script>

<template>
  <div class="detail-tab-list">
    <slot />
  </div>
</template>

<style scoped>
.detail-tab-list:deep(.el-table) {
  border: none;
}
</style>
