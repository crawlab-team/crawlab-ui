<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ChartData, ChartOptions } from 'chart.js';
import useRequest from '@/services/request';
import { translate } from '@/utils';
import useDetail from '@/layouts/content/detail/useDetail';
import { getTimeUnitParts } from '@/utils/time';
import { formatBytes } from '@/utils/metric';
import ClEmpty from '@/components/empty/Empty.vue';

const { get } = useRequest();

const t = translate;

const ns = 'node';

const { activeId } = useDetail<CNode>(ns);

const timeRange = ref<string>('1h');
const timeRanges = ['1h', '24h', '7d', '30d'];
const timeUnits = ['5m', '1h', '6h', '1d'];
const timeRangeOptions = computed<SelectOption[]>(() => {
  return timeRanges.map((value, index) => {
    const label = t('components.node.metric.timeRanges.' + value);
    const timeUnit = timeUnits[index];
    const groups = timeRange.value.match(/(\d+)([a-z])/);
    const num = parseInt(groups[1]);
    const unit = groups[2];
    const start = dayjs().add(-num, unit).toISOString();
    const end = dayjs().toISOString();
    return {
      value,
      label,
      timeUnit,
      start,
      end,
    };
  });
});
const timeUnit = computed(() => {
  return timeRangeOptions.value.find(({ value }) => value === timeRange.value)
    ?.timeUnit;
});
const startEnd = computed(() => {
  const { start, end } = timeRangeOptions.value.find(
    ({ value }) => value === timeRange.value
  );
  return { start, end };
});
const spanGaps = computed(() => {
  const { num, unit } = getTimeUnitParts(timeUnit.value);
  switch (unit) {
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
  }
});
const timeTooltipFormat = computed(() => {
  const { unit } = getTimeUnitParts(timeUnit.value);
  switch (unit) {
    case 'm':
      return 'LLL dd HH:mm:ss';
    case 'h':
      return 'LLL dd HH:mm';
    case 'd':
      return 'LLL dd';
  }
});
const timeDisplayFormats = computed(() => {
  const { unit } = getTimeUnitParts(timeUnit.value);
  switch (unit) {
    case 'm':
    case 'h':
      return {
        minute: 'HH:mm',
        hour: 'HH:mm',
        day: 'MMM dd',
      };
    case 'd':
      return {
        minute: 'HH:mm',
        hour: 'HH:mm',
        day: 'MMM dd',
      };
  }
});

const allMetricGroups: MetricGroup[] = [
  {
    name: 'cpu_usage_percent', // 'cpu_usage_percent
    label: t('components.node.metric.metrics.cpu_usage_percent'),
    metrics: ['cpu_usage_percent'],
  },
  {
    name: 'used_memory_percent',
    label: t('components.node.metric.metrics.used_memory_percent'),
    metrics: ['used_memory_percent'],
  },
  {
    name: 'used_disk_percent',
    label: t('components.node.metric.metrics.used_disk_percent'),
    metrics: ['used_disk_percent'],
  },
  {
    name: 'disk_io_bytes_rate',
    label: t('components.node.metric.groups.disk_io_bytes_rate'),
    metrics: ['disk_read_bytes_rate', 'disk_write_bytes_rate'],
  },
  {
    name: 'network_io_bytes_rate',
    label: t('components.node.metric.groups.network_io_bytes_rate'),
    metrics: ['network_bytes_recv_rate', 'network_bytes_sent_rate'],
  },
  {
    name: 'total_memory',
    label: t('components.node.metric.metrics.total_memory'),
    metrics: ['total_memory'],
  },
  {
    name: 'available_memory',
    label: t('components.node.metric.metrics.available_memory'),
    metrics: ['available_memory'],
  },
  {
    name: 'used_memory',
    label: t('components.node.metric.metrics.used_memory'),
    metrics: ['used_memory'],
  },
  {
    name: 'total_disk',
    label: t('components.node.metric.metrics.total_disk'),
    metrics: ['total_disk'],
  },
  {
    label: t('components.node.metric.metrics.available_disk'),
    metrics: ['available_disk'],
  },
  {
    name: 'used_disk',
    label: t('components.node.metric.metrics.used_disk'),
    metrics: ['used_disk'],
  },
];
const metricGroups = ref<string[]>([
  'cpu_usage_percent',
  'used_memory_percent',
  'used_disk_percent',
  'disk_io_bytes_rate',
  'network_io_bytes_rate',
]);
const metricOptions = computed<SelectOption[]>(() => {
  return allMetricGroups.map(({ label, name: value }: MetricGroup) => {
    return { label, value };
  });
});

const colorPalettes = [
  '#409eff',
  '#e6a23c',
  '#67c23a',
  '#f56c6c',
  '#909399',
  '#0bb2d4',
  '#9c27b0',
  '#ff5722',
  '#795548',
  '#607d8b',
];

const getLineChartData = (name: keyof Metric): ChartData<string, number> => {
  if (!metricsTimeSeriesData.value?.length) return { labels: [], datasets: [] };
  const labels: string[] = metricsTimeSeriesData.value.map(
    ({ _id }: Metric) => new Date(_id)
  );
  const { metrics } = allMetricGroups.find(
    ({ name: groupName }) => groupName === name
  );
  return {
    labels,
    datasets: metrics?.map((m, index) => {
      const color = colorPalettes[index % colorPalettes.length];
      const data: number[] = metricsTimeSeriesData.value.map(
        (metric: Metric) => metric[m]
      );
      return {
        label: t('components.node.metric.metrics.' + m),
        data,
        borderColor: color,
        backgroundColor: color,
        spanGaps: spanGaps.value, // 允许跨越空数据点
        tension: 0.1,
      };
    }),
  };
};

const getLineChartOptions = (groupName: string): ChartOptions<'line'> => {
  const { label, name } = allMetricGroups.find(
    ({ name }) => name === groupName
  );
  return {
    plugins: {
      title: {
        text: label,
        padding: {
          bottom: 20,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let value: string;
            if (name.match(/(percent)$/)) {
              value = Math.round(tooltipItem.raw) + '%';
            } else if (name.match(/(rate)$/)) {
              value =
                formatBytes(tooltipItem.raw) +
                ' / ' +
                t('components.node.metric.timeUnits.s');
            } else {
              value = formatBytes(tooltipItem.raw);
            }
            return tooltipItem.dataset.label + ': ' + value;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          minUnit: 'minute',
          tooltipFormat: timeTooltipFormat.value,
          displayFormats: timeDisplayFormats.value,
        },
        ticks: {
          source: 'auto',
        },
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (name.match(/(percent)$/)) {
              if (!value) return '0%';
              return Math.round(value) + '%';
            } else {
              if (!value) return 0;
              return formatBytes(value);
            }
          },
        },
        title: {
          display: false,
        },
        min: 0,
      },
    },
  };
};

const metricsTimeSeriesData = ref<Metric[]>([]);
const getMetricsTimeSeriesData = async () => {
  const { start, end } = startEnd.value;
  const res = await get<Metric[]>(
    `/nodes/${activeId.value}/metrics/time-range`,
    {
      start,
      end,
      time_unit: timeUnit.value,
      metric_names: metricGroups.value
        .map(groupName => {
          const metricGroup = allMetricGroups.find(
            ({ name }) => name === groupName
          );
          return metricGroup?.metrics?.join(',');
        })
        .filter(m => !!m)
        .join(','),
    }
  );
  metricsTimeSeriesData.value = res.data;
};

let handle: number;
onBeforeMount(getMetricsTimeSeriesData);
onBeforeMount(() => {
  handle = setInterval(getMetricsTimeSeriesData, 60 * 1000);
});
onBeforeUnmount(() => {
  clearInterval(handle);
});
watch(metricGroups, getMetricsTimeSeriesData);
watch(timeUnit, getMetricsTimeSeriesData);
watch(activeId, getMetricsTimeSeriesData);

defineOptions({ name: 'ClNodeDetailTabMonitoring' });
</script>

<template>
  <div class="node-detail-tab-monitoring">
    <div class="control-panel">
      <div class="time-range-select">
        <el-select v-model="timeRange">
          <template #prefix>
            <cl-icon :icon="['fa', 'clock']" />
          </template>
          <el-option
            v-for="{ value, label } in timeRangeOptions"
            :value="value"
            :label="label"
          />
        </el-select>
      </div>
      <div class="metric-select">
        <el-select
          v-model="metricGroups"
          multiple
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          :placeholder="t('components.node.metric.select.placeholder')"
        >
          <template #prefix>
            <cl-icon :icon="['fa', 'line-chart']" />
          </template>
          <el-option
            v-for="{ label, value } in metricOptions"
            :label="label"
            :value="value"
          />
        </el-select>
      </div>
    </div>
    <div class="metric-list">
      <el-space v-if="metricsTimeSeriesData?.length" wrap>
        <el-card v-for="name in metricGroups" shadow="hover">
          <cl-chart
            type="line"
            :data="getLineChartData(name)"
            :options="getLineChartOptions(name)"
          />
        </el-card>
      </el-space>
      <cl-empty v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
.node-detail-tab-monitoring {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  position: relative;

  .control-panel {
    padding: 10px;
    position: sticky;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    border-bottom: 1px solid var(--el-border-color);
    background-color: #ffffff;

    .time-range-select {
      flex: 0 0 160px;
    }

    .metric-select {
      flex: 1;
    }
  }

  .metric-list {
    padding: 10px;
  }
}
</style>
