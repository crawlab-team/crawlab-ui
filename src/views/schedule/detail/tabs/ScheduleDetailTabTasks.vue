<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { FILTER_OP_EQUAL } from '@/constants/filter';

// route
const route = useRoute();

// store
const store = useStore();

// id
const id = computed<string>(() => route.params.id as string);

const setTableListFilter = () => {
  // set filter
  store.commit(`task/setTableListFilter`, [
    {
      key: 'schedule_id',
      op: FILTER_OP_EQUAL,
      value: id.value,
    },
  ]);
};

const getData = async () => {
  setTableListFilter();
  await store.dispatch('task/getList');
};

onBeforeMount(getData);

watch(() => id.value, getData);
onBeforeMount(() => {
  // set filter
  store.commit(`task/setTableListFilter`, [
    {
      key: 'schedule_id',
      op: FILTER_OP_EQUAL,
      value: id.value,
    },
  ]);
});

onBeforeUnmount(() => {
  store.commit(`task/resetTableListFilter`);
  store.commit(`task/resetTableData`);
});
defineOptions({ name: 'ClScheduleDetailTabTasks' });
</script>

<template>
  <div class="schedule-detail-tab-tasks">
    <cl-task-list no-actions embedded />
  </div>
</template>

<style scoped>
.schedule-detail-tab-overview {
  margin: 20px;
}
</style>
