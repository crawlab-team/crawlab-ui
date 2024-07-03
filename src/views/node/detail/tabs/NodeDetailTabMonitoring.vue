<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ChartData, ChartOptions } from 'chart.js';
import useRequest from '@/services/request';
import { translate } from '@/utils';
import useDetail from '@/layouts/content/detail/useDetail';

const { get } = useRequest();

const t = translate;

const ns = 'node';

const { activeId } = useDetail<CNode>(ns);

const timeRange = ref<string>('1h');
const timeRanges = ['1h', '1d', '7d', '30d'];
const timeUnits = ['5m', '15m', '6h', '1d'];
const timeRangeOptions = computed<SelectOption[]>(() => {
  return timeRanges.map((value, index) => {
    const label = t('components.node.metric.timeRanges.' + value);
    const timeUnit = timeUnits[index];
    const groups = timeUnit.match(/(\d+)([a-z])/);
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
  const groups = timeUnit.value.match(/(\d+)([a-z])/);
  const num = parseInt(groups[1]);
  const unit = groups[2];
  switch (unit) {
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
  }
});

const allMetricNames = [
  'cpu_usage_percent',
  'total_memory',
  'available_memory',
  'used_memory',
  'used_memory_percent',
  'total_disk',
  'available_disk',
  'used_disk',
  'used_disk_percent',
  'disk_read_bytes_rate',
  'disk_write_bytes_rate',
  'network_bytes_sent_rate',
  'network_bytes_recv_rate',
];

const metricNames = ref<keyof Metric[]>([
  'cpu_usage_percent',
  'used_memory_percent',
  'used_disk_percent',
]);

const metricOptions = computed<SelectOption[]>(() => {
  return allMetricNames.map(value => ({
    value,
    label: t('components.node.metric.metrics.' + value),
  }));
});

const metricsTimeSeriesData = ref<Metric[]>([]);

const getMetricsTimeSeriesData = async () => {
  const { start, end } = startEnd.value;
  const res = await get<Metric[]>(
    `/nodes/${activeId.value}/metrics/time-range`,
    {
      start,
      end,
      time_unit: timeUnit.value,
      metric_names: metricNames.value.join(','),
    }
  );
  metricsTimeSeriesData.value = res.data;
};

const getLineChartData = (name: keyof Metric): ChartData<string, number> => {
  const labels: string[] = metricsTimeSeriesData.value.map(
    ({ _id }: Metric) => new Date(_id)
  );
  const data: number[] = metricsTimeSeriesData.value.map(
    (metric: Metric) => metric[name]
  );

  return {
    labels,
    datasets: [
      {
        label: t('components.node.metric.metrics.' + name),
        data,
        borderColor: '#409eff',
        backgroundColor: '#409eff',
        spanGaps: spanGaps.value, // 允许跨越空数据点
        tension: 0.1,
      },
    ],
  };
};

const getLineChartOptions = (name: keyof Metric): ChartOptions<'line'> => {
  return {
    plugins: {
      title: {
        text: t('components.node.metric.metrics.' + name),
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
            if (name.match(/(percent|rate)$/)) {
              value = Math.round(tooltipItem.raw) + '%';
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
          tooltipFormat: 'LLL dd HH:mm',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'MMM DD',
          },
        },
        ticks: {
          source: 'auto',
          stepSize: 5,
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
            if (name.match(/(percent|rate)$/)) {
              return Math.round(value) + '%';
            } else {
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

const formatBytes = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

let handle: number;
onBeforeMount(getMetricsTimeSeriesData);
onBeforeMount(() => {
  handle = setInterval(getMetricsTimeSeriesData, 60 * 1000);
});
onBeforeMount(() => {
  clearInterval(handle);
});
watch(metricNames, getMetricsTimeSeriesData);
watch(timeUnit, getMetricsTimeSeriesData);

defineOptions({ name: 'ClNodeDetailTabMonitoring' });
</script>

<template>
  <div class="node-detail-tab-monitoring">
    <div class="control-panel">
      <div class="time-range-select">
        <el-select v-model="timeRange">
          <el-option
            v-for="{ value, label } in timeRangeOptions"
            :value="value"
            :label="label"
          />
        </el-select>
      </div>
      <div class="metric-select">
        <el-select
          v-model="metricNames"
          multiple
          filterable
          clearable
          :placeholder="t('components.node.metric.select.placeholder')"
        >
          <el-option
            v-for="{ label, value } in metricOptions"
            :label="label"
            :value="value"
          />
        </el-select>
      </div>
    </div>
    <el-space wrap>
      <el-card
        v-for="name in metricNames"
        v-if="getLineChartData(name)?.labels?.length"
        shadow="hover"
      >
        <cl-chart
          type="line"
          :data="getLineChartData(name)"
          :options="getLineChartOptions(name)"
        />
      </el-card>
    </el-space>
  </div>
</template>

<style scoped lang="scss">
.node-detail-tab-monitoring {
  margin: 20px;
  display: flex;
  flex-direction: column;

  .control-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;

    .time-range-select {
      flex: 0 0 200px;
    }

    .metric-select {
      flex: 1;
    }
  }
}
</style>
