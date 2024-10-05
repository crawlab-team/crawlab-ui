<script setup lang="ts">
import { computed, StyleValue } from 'vue';
import { merge } from 'lodash';
import { Chart } from 'vue-chartjs';
import { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';

const props = withDefaults(
  defineProps<{
    type: keyof ChartTypeRegistry;
    data?: ChartData;
    options?: ChartOptions;
    height?: string | number;
    width?: string | number;
    minHeight?: string | number;
    minWidth?: string | number;
  }>(),
  {
    type: 'line',
    height: '100%',
    width: '100%',
    minHeight: '300px',
    minWidth: '300px',
  }
);

const computedOptions = computed<ChartOptions>(() => {
  const { options } = props;
  return merge(options, {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        align: 'start',
      },
    },
  }) as ChartOptions;
});

const style = computed<StyleValue>(() => {
  const { height, width, minHeight, minWidth } = props;
  return {
    height,
    width,
    minHeight,
    minWidth,
  };
});

defineOptions({ name: 'ClChart' });
</script>

<template>
  <div v-if="data && computedOptions" class="chart" :style="style">
    <chart
      :key="JSON.stringify([type, data, computedOptions])"
      :type="type"
      :data="data"
      :options="computedOptions"
    />
  </div>
</template>
