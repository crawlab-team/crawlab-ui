import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  PolarAreaController,
  RadarController,
  BubbleController,
  ScatterController,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

export const initChartJS = () => {
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    CategoryScale,
    LineController,
    BarController,
    PieController,
    DoughnutController,
    PolarAreaController,
    RadarController,
    BubbleController,
    ScatterController
  );
};
