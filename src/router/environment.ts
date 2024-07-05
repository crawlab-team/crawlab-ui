import { RouteRecordRaw } from 'vue-router';
import { ClEnvironmentList } from '@/views';

const endpoint = 'environments';

export default [
  {
    name: 'EnvironmentList',
    path: endpoint,
    component: ClEnvironmentList,
  },
] as Array<RouteRecordRaw>;
