import { RouteRecordRaw } from 'vue-router';
import EnvironmentList from '@/views/environment/list/EnvironmentList.vue';

const endpoint = 'environments';

export default [
  {
    name: 'EnvironmentList',
    path: endpoint,
    component: EnvironmentList,
  },
] as Array<RouteRecordRaw>;
