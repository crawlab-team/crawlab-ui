<script setup lang="ts">
defineOptions({ name: 'ClMetricLineChart' });
import { computed } from 'vue';
import { plainClone } from '@/utils/object';

interface LineChartProps {
  config: EChartsConfig;
  width?: string;
  height?: string;
  theme?: string;
  labelKey?: string;
  valueKey?: string;
  isTimeSeries?: boolean;
}

const props = defineProps<
  LineChartProps & {
    metric?: string;
  }
>();

const config = computed<EChartsConfig>(() => {
  const config = plainClone(props.config);
  return Object.assign(config || {}, {
    option: {
      title: {
        show: false,
      },
      tooltip: {
        axisPointer: {
          type: 'cross',
        },
      },
      yAxis: {
        scale: true,
      },
    },
  }) as EChartsConfig;
});

const title = computed<string>(() => `Metric: ${props.metric}`);
</script>

<template>
  <div class="metric-line-chart">
    <div class="metric-line-chart-top">
      <div class="title">
        {{ title }}
      </div>
    </div>
    <cl-line-chart :config="config" />
  </div>
</template>

<style lang="scss" scoped>
.metric-line-chart {
  height: 100%;

  .metric-line-chart-top {
    padding: 10px;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--cl-info-color);
    }
  }
}
</style>
