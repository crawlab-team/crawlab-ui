<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { FILTER_OP_EQUAL } from '@/constants/filter';

// route
const route = useRoute();

// store
const store = useStore();

// id
const id = computed<string>(() => route.params.id as string);

const setTableListFilter = () => {
  // set filter
  store.commit(`schedule/setTableListFilter`, [
    {
      key: 'spider_id',
      op: FILTER_OP_EQUAL,
      value: id.value,
    },
  ]);
};

const getData = async () => {
  setTableListFilter();
  await store.dispatch('schedule/getList');
};

onBeforeMount(getData);

watch(() => id.value, getData);

onBeforeUnmount(() => {
  store.commit(`schedule/resetTableListFilter`);
  store.commit(`schedule/resetTableData`);
});

defineOptions({ name: 'ClSpiderDetailTabSchedules' });
</script>

<template>
  <div class="spider-detail-tab-schedules">
    <cl-schedule-list no-actions embedded />
  </div>
</template>

<style scoped>
.spider-detail-tab-schedules:deep(.el-table) {
  border: none;
}
</style>
