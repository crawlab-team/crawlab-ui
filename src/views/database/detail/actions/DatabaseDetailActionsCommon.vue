<script setup lang="ts">
import { useStore } from 'vuex';
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { isPro } from '@/utils';
import useRequest from '@/services/request';
import useDetail from '../../../../layouts/content/detail/useDetail';

const { get } = useRequest();

const ns = 'node';

const { activeId } = useDetail<Database>(ns);

const store = useStore();
const { database: state } = store.state as RootStoreState;

const form = computed<Database>(() => state.form);

const currentMetricsData = ref<BasicMetric>();
const getCurrentMetricsData = async () => {
  const res = await get(`/databases/${activeId.value}/metrics/current`);
  currentMetricsData.value = res.data;
};

let handle: any;
onBeforeMount(getCurrentMetricsData);
onBeforeMount(() => {
  handle = setInterval(getCurrentMetricsData, 60 * 1000);
});
onBeforeUnmount(() => {
  clearInterval(handle);
});
watch(activeId, getCurrentMetricsData);

defineOptions({ name: 'ClDatabaseDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'database']" />
    <cl-nav-action-item>
      <cl-database-status
        :status="form.status"
        :error="form.error"
        size="large"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'tachometer-alt']" />
    <cl-nav-action-item>
      <cl-current-metrics
        :metric="currentMetricsData"
        size="large"
        :metrics="['used_memory_percent', 'used_disk_percent']"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped>
.nav-action-group {
  &:deep(.tag) {
    margin-right: 10px;
  }
}
</style>
