import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

export const initChartJS = () => {
  ChartJS.register(...registerables);
};

export const colorPalette = [
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
