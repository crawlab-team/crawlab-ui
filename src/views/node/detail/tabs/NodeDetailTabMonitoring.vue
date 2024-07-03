<script setup lang="ts">
defineOptions({ name: 'ClNodeDetailTabMonitoring' });
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { ChartConfiguration } from 'chart.js/dist/types';
import { Chart, registerables } from 'chart.js';
import useDetail from '@/layouts/content/detail/useDetail';
import useRequest from '@/services/request';

Chart.register(...registerables);

const { get } = useRequest();

const ns = 'node';

const { activeId } = useDetail<CNode>(ns);

const timeSeriesData = ref<any>([]);

const getMonitoringData = async () => {
  const res = await get(`/nodes/${activeId.value}/metrics/time-range`, {
    start: dayjs().add(-1, 'hour').toISOString(),
    end: dayjs().toISOString(),
    time_unit: '5m',
    metric_names: [
      'cpu_usage_percent',
      'used_memory_percent',
      'used_disk_percent',
    ].join(','),
  });
  timeSeriesData.value = res.data;
  renderChart();
};

const renderChart = () => {
  // 准备数据集
  const labels = timeSeriesData.value.map((data: any) => {
    return new Date(data._id);
  });
  const values = timeSeriesData.value.map((data: any) => {
    console.debug('data', data.cpu_usage_percent);
    data.cpu_usage_percent;
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'CPU Usage Percent',
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // 配置选项
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: 'Node Monitoring',
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            tooltipFormat: 'll HH:mm',
          },
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
          },
        },
      },
    },
  } as ChartConfiguration<any>;

  // 渲染图表
  const ctx = canvasRef.value?.getContext('2d');
  if (!ctx) return;
  console.debug('ctx', ctx);
  console.debug('config', config);
  new Chart(ctx, config);
};

onMounted(getMonitoringData);

const canvasRef = ref<HTMLCanvasElement>();
</script>

<template>
  <div class="node-detail-tab-monitoring">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped lang="scss">
.node-detail-tab-monitoring {
  canvas {
    width: 100%;
    height: 300px;
  }
}
</style>
