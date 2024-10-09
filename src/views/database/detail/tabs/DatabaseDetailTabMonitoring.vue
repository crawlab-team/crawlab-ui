<script setup lang="ts">
import { computed, ref } from 'vue';
import { getDatabaseAllMetricGroups } from '@/utils/database';
import { loadLocalStorage, saveLocalStorage } from '@/utils/storage';
import { useStore } from 'vuex';

const store = useStore();
const { database: state } = store.state as RootStoreState;

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

const availableMetricGroups = computed(() => {
  const { form } = state;
  if (!form) return [];
  const { data_source } = form;
  return getDatabaseAllMetricGroups()
    .map(({ name }) => name)
    .filter(name => {
      switch (data_source) {
        case 'mongo':
          return !['cpu_usage_percent'].includes(name);
        case 'mysql':
          return ![
            'cpu_usage_percent',
            'total_disk',
            'available_disk',
            'used_disk_percent',
            'replication_lag',
            'lock_wait_time',
          ].includes(name);
        case 'postgres':
          return ![
            'cpu_usage_percent',
            'total_memory',
            'available_memory',
            'used_memory_percent',
            'total_disk',
            'available_disk',
            'used_disk_percent',
          ].includes(name);
        case 'mssql':
          return !['cpu_usage_percent'].includes(name);
        case 'elasticsearch':
          return ![
            'connections',
            'cache_hit_ratio',
            'replication_lag',
            'lock_wait_time',
          ].includes(name);
        default:
          return true;
      }
    });
});

defineOptions({ name: 'ClDatabaseDetailTabMonitoring' });
</script>

<template>
  <cl-metric-monitoring-detail
    ns="database"
    api-prefix="/databases"
    :default-metric-groups="defaultMetricGroups"
    :default-time-range="defaultTimeRange"
    :all-metric-groups-fn="getDatabaseAllMetricGroups"
    :available-metric-groups="availableMetricGroups"
    @time-range-change="onTimeRangeChange"
    @metric-groups-change="onMetricGroupsChange"
  />
</template>
