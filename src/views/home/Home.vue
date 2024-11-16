<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { ChartData, ChartOptions } from 'chart.js';
import {
  TASK_STATUS_CANCELLED,
  TASK_STATUS_ERROR,
  TASK_STATUS_FINISHED,
  TASK_STATUS_PENDING,
  TASK_STATUS_RUNNING,
} from '@/constants/task';
import useRequest from '@/services/request';
import { getColorByKey, translate } from '@/utils';
import { spanDateRange } from '@/utils/stats';
import { colorPalette } from '@/utils/chart';

const t = translate;

const { get } = useRequest();

const router = useRouter();

const dateRange = ref<DateRange>({
  start: dayjs().subtract(30, 'day'),
  end: dayjs(),
});

const metrics = ref<MetricMeta[]>([
  {
    name: 'views.home.metrics.nodes',
    icon: ['fa', 'server'],
    key: 'nodes',
    value: 0,
    path: '/nodes',
  },
  {
    name: 'views.home.metrics.projects',
    icon: ['fa', 'project-diagram'],
    key: 'projects',
    value: 0,
    path: '/projects',
  },
  {
    name: 'views.home.metrics.spiders',
    icon: ['fa', 'spider'],
    key: 'spiders',
    value: 0,
    path: '/spiders',
  },
  {
    name: 'views.home.metrics.schedules',
    icon: ['fa', 'clock'],
    key: 'schedules',
    value: 0,
    path: '/schedules',
  },
  {
    name: 'views.home.metrics.tasks',
    icon: ['fa', 'tasks'],
    key: 'tasks',
    value: 0,
    path: '/tasks',
  },
  {
    name: 'views.home.metrics.error_tasks',
    icon: ['fa', 'exclamation'],
    key: 'error_tasks',
    value: 0,
    path: '/tasks',
    color: (m: MetricMeta) =>
      (m.value as number) > 0
        ? getColorByKey('danger')
        : getColorByKey('success'),
  },
  {
    name: 'views.home.metrics.results',
    icon: ['fa', 'table'],
    key: 'results',
    value: 0,
    color: (m: MetricMeta) =>
      (m.value as number) > 0
        ? getColorByKey('success')
        : getColorByKey('info-medium'),
  },
  {
    name: 'views.home.metrics.users',
    icon: ['fa', 'users'],
    key: 'users',
    value: 0,
    path: '/users',
  },
]);

const dailyData = ref<any[]>([]);
const dailyChartData = computed<ChartData>(() => {
  return {
    labels: spanDateRange(
      dateRange.value.start,
      dateRange.value.end,
      dailyData.value,
      '_id'
    ).map((d: any) => d._id),
    datasets: [
      {
        label: t('views.home.metrics.tasks'),
        data: dailyData.value.map((d: any) => d.tasks || 0),
        borderColor: getColorByKey('primary'),
        backgroundColor: getColorByKey('primary'),
        yAxisID: 'y',
      },
      {
        label: t('views.home.metrics.results'),
        data: dailyData.value.map((d: any) => d.results || 0),
        borderColor: getColorByKey('success'),
        backgroundColor: getColorByKey('success'),
        yAxisID: 'y1',
      },
    ],
  };
});
const dailyChartOptions = ref<ChartOptions>({
  plugins: {
    title: {
      text: t('views.home.dailyConfig.title'),
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: t('views.home.metrics.tasks'),
      },
      type: 'linear',
      display: true,
      position: 'left',
      min: 0,
    },
    y1: {
      title: {
        display: true,
        text: t('views.home.metrics.results'),
      },
      type: 'linear',
      display: true,
      position: 'right',
      min: 0,
    },
  },
});

const getTaskStatusColorByLabel = (label: string) => {
  switch (label) {
    case TASK_STATUS_PENDING:
      return getColorByKey('primary');
    case TASK_STATUS_RUNNING:
      return getColorByKey('warning');
    case TASK_STATUS_FINISHED:
      return getColorByKey('success');
    case TASK_STATUS_ERROR:
      return getColorByKey('danger');
    case TASK_STATUS_CANCELLED:
      return getColorByKey('info-medium');
    default:
      return 'red';
  }
};

const tasksByStatusData = ref([]);
const tasksByStatusChartData = computed<ChartData>(() => {
  return {
    labels: tasksByStatusData.value?.map((d: any) =>
      t('components.task.status.label.' + d.status)
    ),
    datasets: [
      {
        label: t('views.home.metrics.tasks'),
        data: tasksByStatusData.value?.map((d: any) => d.tasks),
        backgroundColor: tasksByStatusData.value?.map((d: any) =>
          getTaskStatusColorByLabel(d.status)
        ),
      },
    ],
  };
});
const tasksByStatusChartOptions = ref<ChartOptions>({
  plugins: {
    title: {
      display: true,
      text: t('views.home.tasksByStatusConfig.title'),
    },
  },
});

const tasksByNodeData = ref([]);
const tasksByNodeChartData = computed<ChartData>(() => {
  return {
    labels: tasksByNodeData.value?.map((d: any) => d.node_name),
    datasets: [
      {
        label: t('views.home.metrics.tasks'),
        data: tasksByNodeData.value?.map((d: any) => d.tasks),
        backgroundColor: tasksByNodeData.value?.map(
          (_: any, index: number) => colorPalette[index % colorPalette.length]
        ),
      },
    ],
  };
});
const tasksByNodeChartOptions = ref<ChartOptions>({
  plugins: {
    title: {
      display: true,
      text: t('views.home.tasksByNodeConfig.title'),
    },
  },
});

const tasksBySpiderData = ref([]);
const tasksBySpiderChartData = computed<ChartData>(() => {
  return {
    labels: tasksBySpiderData.value?.map((d: any) => d.spider_name),
    datasets: [
      {
        label: t('views.home.metrics.tasks'),
        data: tasksBySpiderData.value?.map((d: any) => d.tasks),
        backgroundColor: tasksBySpiderData.value?.map(
          (_: any, index: number) => colorPalette[index % colorPalette.length]
        ),
      },
    ],
  };
});
const tasksBySpiderChartOptions = ref<ChartOptions>({
  plugins: {
    title: {
      display: true,
      text: t('views.home.tasksBySpiderConfig.title'),
    },
  },
});

const getOverview = async () => {
  // TODO: filter by date range?
  // const {start, end} = dateRange.value;
  const res = await get(`/stats/overview`);
  metrics.value.forEach(m => {
    m.value = res?.data[m.key];
  });
};

const getDaily = async () => {
  // TODO: filter by date range?
  const { start, end } = dateRange.value;
  const res = await get(`/stats/daily`);
  dailyData.value = spanDateRange(start, end, res?.data || [], 'date');
};

const getTasks = async () => {
  const res = await get(`/stats/tasks`);
  tasksByStatusData.value = res?.data.by_status;
  tasksByNodeData.value = res?.data.by_node;
  tasksBySpiderData.value = res?.data.by_spider;
};

const getData = async () =>
  Promise.all([getOverview(), getDaily(), getTasks()]);

const onMetricClick = (m: MetricMeta) => {
  if (m.path) {
    router.push(m.path);
  }
};

const defaultColorFunc = (value: string | number) => {
  if (typeof value === 'number') {
    // number
    if (value === 0) {
      return getColorByKey('info-medium');
    } else {
      return getColorByKey('primary');
    }
  } else {
    // string
    const v = Number(value);
    if (isNaN(v) || v == 0) {
      return getColorByKey('info-medium');
    } else {
      return getColorByKey('primary');
    }
  }
};

const getColor = (m: MetricMeta) => {
  if (!m.color) {
    return defaultColorFunc(m.value);
  } else if (typeof m.color === 'function') {
    return m.color(m);
  } else {
    return m.color;
  }
};

onMounted(async () => {
  await getData();
});

defineOptions({ name: 'ClHome' });
</script>

<template>
  <el-scrollbar>
    <div class="home">
      <el-row class="row-overview-metrics">
        <el-col
          v-for="(m, i) in metrics"
          :key="i"
          :span="24 / Math.min(metrics.length, 4)"
        >
          <cl-metric
            :icon="m.icon"
            :title="m.name"
            :value="m.value"
            :clickable="!!m.path"
            :color="getColor(m)"
            @click="onMetricClick(m)"
          />
        </el-col>
      </el-row>
      <el-row class="row-line-chart">
        <cl-chart
          type="line"
          :data="dailyChartData"
          :options="dailyChartOptions"
        />
      </el-row>
      <el-row class="row-pie-chart">
        <el-col :span="8">
          <cl-chart
            type="pie"
            :data="tasksByStatusChartData"
            :options="tasksByStatusChartOptions"
          />
        </el-col>
        <el-col :span="8">
          <cl-chart
            type="pie"
            :data="tasksByNodeChartData"
            :options="tasksByNodeChartOptions"
          />
        </el-col>
        <el-col :span="8">
          <cl-chart
            type="pie"
            :data="tasksBySpiderChartData"
            :options="tasksBySpiderChartOptions"
          />
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.home {
  background: white;
  min-height: calc(
    100vh - var(--cl-header-height) - var(--cl-tabs-view-height)
  );
  padding: 20px;

  .row-overview-metrics {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .row-line-chart {
    height: 400px;
  }

  .row-pie-chart {
    height: 400px;
  }
}
</style>
