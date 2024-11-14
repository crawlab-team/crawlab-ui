<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import dayjs, { UnitTypeShort } from 'dayjs';
import { ChartData, ChartOptions } from 'chart.js';
import useRequest from '@/services/request';
import { translate } from '@/utils';
import { getTimeUnitParts } from '@/utils/time';
import { getMetricFormatValue } from '@/utils/metric';
import { colorPalette } from '@/utils/chart';
import { useDetail } from '@/layouts';

const props = defineProps<{
  ns: ListStoreNamespace;
  apiPrefix: string;
  defaultMetricGroups?: string[];
  defaultTimeRange?: string;
  allMetricGroupsFn?: () => MetricGroup[];
  availableMetricGroups?: string[];
}>();

const emit = defineEmits<{
  (e: 'time-range-change', timeRange: string): void;
  (e: 'metric-groups-change', metricGroups: string[]): void;
}>();

const { get } = useRequest();

const t = translate;

const { activeId } = useDetail(props.ns);

const timeRange = ref<string>(props.defaultTimeRange || '1h');
const timeRanges = ['1h', '24h', '7d', '30d'];
const timeUnits = ['5m', '1h', '6h', '1d'];
const timeRangeOptions = computed<any[]>(() => {
  return timeRanges.map((value, index) => {
    const label = t('components.metric.timeRanges.' + value);
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

const metricGroups = ref<string[]>(props.defaultMetricGroups || []);
const { allMetricGroupsFn } = props;
const metricOptions = computed<SelectOption[]>(() => {
  return (
    allMetricGroupsFn?.()?.map(({ label, name: value }: MetricGroup) => {
      return { label, value };
    }) || []
  );
});

const getLineChartData = (name: string): ChartData => {
  const { allMetricGroupsFn } = props;
  if (!metricsTimeSeriesData.value?.length) return { labels: [], datasets: [] };
  const labels: Date[] = metricsTimeSeriesData.value.map(
    ({ _id }: Metric) => new Date(_id as string)
  );
  const { metrics } =
    allMetricGroupsFn?.()?.find(({ name: groupName }) => groupName === name) ||
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
          label: t('components.metric.metrics.' + m),
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
  const { allMetricGroupsFn } = props;
  const metricGroup = allMetricGroupsFn?.()?.find(
    ({ name }) => name === groupName
  );
  if (!metricGroup) return {};
  const { label } = metricGroup;
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
            const value = getMetricFormatValue(
              metricGroup,
              tooltipItem.raw as number
            );
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
            if (typeof value !== 'number') {
              return value;
            }
            return getMetricFormatValue(metricGroup, value);
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
  const { apiPrefix, allMetricGroupsFn } = props;
  const { start, end } = startEnd.value;
  const res = await get<Metric[]>(
    `${apiPrefix}/${activeId.value}/metrics/time-range`,
    {
      start,
      end,
      time_unit: timeUnit.value,
      metric_names: metricGroups.value
        .map(groupName => {
          const metricGroup: MetricGroup | undefined =
            allMetricGroupsFn?.()?.find(({ name }) => name === groupName);
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

const getMetricGroupLabel = (name: string) => {
  const { allMetricGroupsFn } = props;
  const metricGroup = allMetricGroupsFn?.()?.find(
    ({ name: groupName }) => groupName === name
  );
  return metricGroup?.label || name;
};

const isAvailable = (metricGroupName: string) => {
  const { availableMetricGroups } = props;
  if (!availableMetricGroups) return true;
  return availableMetricGroups.includes(metricGroupName);
};

defineOptions({ name: 'ClMetricMonitoringDetail' });
</script>

<template>
  <div class="metric-monitoring-detail">
    <div class="control-panel">
      <div class="time-range-select">
        <el-select
          v-model="timeRange"
          @change="(value: string) => emit('time-range-change', value)"
        >
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
          :placeholder="t('components.metric.select.placeholder')"
          @change="(value: string[]) => emit('metric-groups-change', value)"
        >
          <template #prefix>
            <cl-icon :icon="['fa', 'line-chart']" />
          </template>
          <el-option
            v-for="{ label, value } in metricOptions"
            :label="
              isAvailable(value)
                ? label
                : `${label} (${t('components.metric.unavailable.option')})`
            "
            :value="value"
          />
        </el-select>
      </div>
    </div>
    <div class="metric-list">
      <el-space v-if="metricsTimeSeriesData?.length" wrap>
        <el-card v-for="name in metricGroups" shadow="hover">
          <cl-chart
            v-if="isAvailable(name)"
            :key="JSON.stringify([name, metricsTimeSeriesData])"
            type="line"
            :data="getLineChartData(name)"
            :options="getLineChartOptions(name)"
          />
          <div v-else class="unavailable-metric">
            <el-empty :description="t('components.metric.unavailable.chart')" />
            <div class="label">
              {{ getMetricGroupLabel(name) }}
            </div>
          </div>
        </el-card>
      </el-space>
      <cl-empty v-else />
    </div>
  </div>
</template>

<style scoped>
.metric-monitoring-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  position: relative;

  &:deep(.el-empty) {
    width: 300px;
    height: 300px;
  }

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

    .unavailable-metric {
      position: relative;

      .label {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 12px;
        font-weight: 500;
        color: #666666;
      }
    }
  }
}
</style>
