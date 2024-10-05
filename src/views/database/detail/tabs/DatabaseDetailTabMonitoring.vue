<script setup lang="ts">
import { ref } from 'vue';
import { getDatabaseAllMetricGroups } from '@/utils/database';
import { loadLocalStorage, saveLocalStorage } from '@/utils/storage';

const timeRangeKey = 'database.monitoring.timeRange';
const metricGroupsKey = 'database.monitoring.metricGroups';

const defaultTimeRange = ref<string>(loadLocalStorage(timeRangeKey) || '1h');

const defaultMetricGroups = ref<string[]>(
  loadLocalStorage(metricGroupsKey) || [
    'used_memory_percent',
    'used_memory',
    'used_disk_percent',
    'used_disk',
    'connections',
    'query_per_second',
  ]
);

const onTimeRangeChange = (timeRange: string) => {
  saveLocalStorage(timeRangeKey, timeRange);
};

const onMetricGroupsChange = (metricGroups: string[]) => {
  saveLocalStorage(metricGroupsKey, metricGroups);
};

defineOptions({ name: 'ClDatabaseDetailTabMonitoring' });
</script>

<template>
  <cl-metric-monitoring-detail
    ns="database"
    api-prefix="/databases"
    :default-metric-groups="defaultMetricGroups"
    :default-time-range="defaultTimeRange"
    :all-metric-groups-fn="getDatabaseAllMetricGroups"
    @time-range-change="onTimeRangeChange"
    @metric-groups-change="onMetricGroupsChange"
  />
</template>
