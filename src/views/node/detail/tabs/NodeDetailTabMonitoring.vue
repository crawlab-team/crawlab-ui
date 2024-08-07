<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import dayjs, { UnitTypeShort } from 'dayjs';
import { ChartData, ChartOptions } from 'chart.js';
import useRequest from '@/services/request';
import { translate } from '@/utils';
import { getTimeUnitParts } from '@/utils/time';
import { formatBytes, getAllMetricGroups } from '@/utils/metric';
import { colorPalette } from '@/utils/chart';
import useDetail from '@/layouts/content/detail/useDetail';
import ClEmpty from '@/components/ui/empty/Empty.vue';

const { get } = useRequest();

const t = translate;

const ns = 'node';

const { activeId } = useDetail<CNode>(ns);

const timeRange = ref<string>('1h');
const timeRanges = ['1h', '24h', '7d', '30d'];
const timeUnits = ['5m', '1h', '6h', '1d'];
const timeRangeOptions = computed<any[]>(() => {
  return timeRanges.map((value, index) => {
    const label = t('components.node.metric.timeRanges.' + value);
    const timeUnit = timeUnits[index];
    const groups = timeRange.value.match(/(\d+)([a-z])/);
    if (!groups) return {};
    const num = parseInt(groups[1]) as number;
    const unit = groups[2] as UnitTypeShort;
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
  const { start, end } =
    timeRangeOptions.value.find(({ value }) => value === timeRange.value) || {};
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

const metricGroups = ref<string[]>([
  'cpu_usage_percent',
  'used_memory_percent',
  'used_disk_percent',
  'disk_io_bytes_rate',
  'network_io_bytes_rate',
]);
const metricOptions = computed<SelectOption[]>(() => {
  return getAllMetricGroups().map(({ label, name: value }: MetricGroup) => {
    return { label, value };
  });
});

const getLineChartData = (name: string): ChartData => {
  if (!metricsTimeSeriesData.value?.length) return { labels: [], datasets: [] };
  const labels: Date[] = metricsTimeSeriesData.value.map(
    ({ _id }: Metric) => new Date(_id as string)
  );
  const { metrics } =
    getAllMetricGroups().find(({ name: groupName }) => groupName === name) ||
    {};
  return {
    labels,
    datasets:
      metrics?.map((m: keyof Metric, index: number) => {
        const color = colorPalette[index % colorPalette.length];
        const data: number[] = metricsTimeSeriesData.value.map(
          (metric: Metric) => metric[m] as number
        );
        return {
          label: t('components.node.metric.metrics.' + m),
          data,
          borderColor: color,
          backgroundColor: color,
          spanGaps: spanGaps.value, // 允许跨越空数据点
          tension: 0.1,
        };
      }) || [],
  };
};

const getLineChartOptions = (groupName: string): ChartOptions<'line'> => {
  const { label, name } =
    getAllMetricGroups().find(({ name }) => name === groupName) || {};
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
            if (name?.match(/(percent)$/)) {
              value = Math.round(tooltipItem.raw as number) + '%';
            } else if (name?.match(/(rate)$/)) {
              value =
                formatBytes(tooltipItem.raw as number) +
                ' / ' +
                t('components.node.metric.timeUnits.s');
            } else {
              value = formatBytes(tooltipItem.raw as number);
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
            if (typeof value !== 'number') return value;
            if (name?.match(/(percent)$/)) {
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
          const metricGroup = getAllMetricGroups().find(
            ({ name }) => name === groupName
          );
          return metricGroup?.metrics?.join(',');
        })
        .filter(m => !!m)
        .join(','),
    }
  );
  metricsTimeSeriesData.value = res.data || [];
};

let handle: any;
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
