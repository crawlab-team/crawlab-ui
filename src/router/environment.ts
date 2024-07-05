import { RouteRecordRaw } from 'vue-router';
import { ClEnvironmentList } from '@/views';

const endpoint = 'environments';

export default [
  {
    name: 'EnvironmentList',
    path: endpoint,
    component: async () => ClEnvironmentList,
  },
] as Array<RouteRecordRaw>;
